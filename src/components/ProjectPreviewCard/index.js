import {
    Flex,
    Heading,
    Text,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    HStack,
    Tag,
    TagLabel,
    LinkBox,
    LinkOverlay,
} from '@chakra-ui/react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { BiUser, BiTimeFive, BiHourglass } from 'react-icons/bi'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

function ProjectPreviewCard({ project, isAdmin, externalDetails, onClick }) {
    const [admin, setAdmin] = useState('')
    const [location, setLocation] = useState('')

    const router = useRouter()
    const currentDate = DateTime.now()
    const expirationDate = DateTime.fromISO(project.expiresIn)
    const difference = expirationDate.diff(currentDate, ['days'])
    const remaningDays = `${Math.round(difference.toObject().days)} days`

    const getAdmin = async () => {
        const response = await fetch(`/api/user/${project.admin}`)
        const user = await response.json()
        setAdmin(user.username)
        setLocation(user.location)
    }

    useEffect(() => {
        getAdmin()
    }, [])

    const deleteProjectIdea = async (id) => {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })

            if (!response.ok) {
                throw Error(
                    'Something went wrong while trying to delete project idea.'
                )
            }
            const data = await response.json()
            return router.reload()
        } catch (error) {
            console.log('Error while deleting project idea,')
        }
    }

    const selectedProjectHandler = () => {
        if (externalDetails) {
            return
        }
        onClick()
    }

    return (
        <LinkBox
            as="article"
            width={['100%', '100%', '95%', '95%']}
            style={{ cursor: 'pointer' }}
        >
            <Flex
                borderWidth="2px"
                borderRadius="lg"
                borderColor={isAdmin ? 'green.500' : ''}
                width="100%"
                padding="1rem"
                flexDirection="column"
                textAlign="left"
                gap={1}
                height="280px"
            >
                <Flex align="center" justify="space-between">
                    {/* If the viewport is above medium, onClick changes selectedProject */}
                    <LinkOverlay
                        onClick={selectedProjectHandler}
                        href={
                            externalDetails
                                ? `/projects/${project._id}`
                                : undefined
                        }
                        isExternal={externalDetails ? true : false}
                    >
                        <Heading size="md" noOfLines={1}>
                            {project.title}
                        </Heading>
                    </LinkOverlay>
                    <Menu>
                        <MenuButton
                            variant="ghost"
                            as={IconButton}
                            icon={<BsThreeDotsVertical fontSize={20} />}
                        />
                        <MenuList>
                            {isAdmin ? (
                                <MenuItem
                                    onClick={() =>
                                        deleteProjectIdea(project._id)
                                    }
                                >
                                    Delete
                                </MenuItem>
                            ) : (
                                <MenuItem>Report</MenuItem>
                            )}
                        </MenuList>
                    </Menu>
                </Flex>
                <Flex gap={10}>
                    <Flex align="center" gap={1}>
                        <BiUser />
                        <Heading
                            size="xs"
                            fontWeight={500}
                        >{`${admin} `}</Heading>
                    </Flex>
                    {location != '' && (
                        <Flex align="center" gap={1}>
                            <BiTimeFive />
                            <Heading size="xs" fontWeight={500}>
                                {location}
                            </Heading>
                        </Flex>
                    )}
                </Flex>
                <Flex align="center" gap={1}>
                    <BiHourglass />
                    <Heading
                        size="xs"
                        fontWeight={500}
                        color="red.500"
                    >{`Expires in ${remaningDays}`}</Heading>
                </Flex>

                <HStack spacing={2}>
                    {project.technologies.map(
                        (tech, index) =>
                            index < 3 && (
                                <Tag
                                    key={index}
                                    variant="solid"
                                    colorScheme="gray"
                                >
                                    <TagLabel>{tech}</TagLabel>
                                </Tag>
                            )
                    )}
                    {project.technologies.length > 3 ? (
                        <Tag variant="solid" colorScheme="green">
                            <TagLabel>+</TagLabel>
                        </Tag>
                    ) : (
                        ''
                    )}
                </HStack>
                <Text fontSize="sm" noOfLines={[4, 4, 3]} marginTop={4}>
                    {project.details}
                </Text>
            </Flex>
        </LinkBox>
    )
}

export default ProjectPreviewCard
