import {
    Flex,
    Text,
    Heading,
    FormControl,
    FormLabel,
    Input,
    RadioGroup,
    Radio,
    HStack,
    Button,
    Tooltip,
} from '@chakra-ui/react'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

function CreateProfile() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { data: session, status } = useSession()

    const inputMarginBottom = '1rem'
    const labelMarginBottom = '0'

    // Input Values
    const [username, setUsername] = useState('')
    const [location, setLocation] = useState('')
    const [email, setEmail] = useState('')
    const [discordId, setDiscordId] = useState('')
    const [methodOfContact, setMethodOfContact] = useState('email')
    const [githubLink, setGithubLink] = useState('')

    // Input didFocusOn
    const [didFocusOnUsername, setDidFocusOnUsername] = useState(false)
    const [didFocusOnEmail, setDidFocusOnEmail] = useState(false)
    const [didFocusOnDiscordId, setDidFocusOnDiscordId] = useState(false)

    // Input Validation
    // a) Required Inputs
    const usernameIsValid =
        username.length > 4 && username.length < 17 && !username.includes(' ')

    const emailIsValid = email.includes('@') && email.includes('.')

    const discordIdIsValid = discordId.includes('#')

    const methodOfContactIsValid =
        methodOfContact === 'email' || methodOfContact === 'discord'
            ? true
            : false

    // b) Optional Inputs
    const locationIsValid =
        location.length > 0 ? location.includes(', ') : location === ''

    const githubLinkIsValid =
        githubLink.length > 0
            ? githubLink.includes('https://github.com/')
            : githubLink === ''

    //Form Validation
    const formIsValid =
        usernameIsValid &&
        locationIsValid &&
        emailIsValid &&
        discordIdIsValid &&
        methodOfContactIsValid &&
        githubLinkIsValid

    const formSubmit = async () => {
        let formData = {
            authenticatedDiscordId: session.userId,
            username,
            location,
            email,
            discordUsername: discordId,
            preferredMethodOfContact: methodOfContact,
            githubLink,
        }

        if (formIsValid) {
            setIsLoading(true)
            try {
                const response = await fetch('/api/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })

                // Removed this for now. This code block throws an error when backend send custom 400 status code
                // if (!response.ok) {
                //     throw new Error(
                //         'Something went wrong while attempting to create user.'
                //     )
                // }
                const data = await response.json()
                if (response.status == '200') {
                    if (router.pathname === '/projects') {
                        return router.reload()
                    }
                    return router.replace('/projects')
                }
                setIsLoading(false)
                console.log(data)
            } catch (error) {
                setIsLoading(false)
                console.log(error)
                console.log('1. Something went wrong.')
            }
        }
    }

    return (
        <Flex
            borderWidth="2px"
            borderRadius="lg"
            width="90%"
            padding="2rem"
            flexDirection="column"
            textAlign="left"
            gap={2}
        >
            <Heading size="xl">Member</Heading>
            <Text fontSize="xs">
                Please be aware that your profile information will be visible to
                other members when requesting to join their projects on this
                platform.
            </Text>
            <FormControl>
                <FormLabel marginBottom={labelMarginBottom}>Username</FormLabel>
                <Input
                    isInvalid={didFocusOnUsername && !usernameIsValid}
                    isRequired
                    onFocus={() => {
                        setDidFocusOnUsername(true)
                    }}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                    type="text"
                    marginBottom={inputMarginBottom}
                />

                <Flex align="center">
                    <FormLabel marginBottom={labelMarginBottom} marginRight={1}>
                        Location
                    </FormLabel>
                    <Text fontSize="xs">(optional)</Text>
                </Flex>
                <Input
                    isInvalid={!locationIsValid}
                    placeholder="City, Country"
                    onChange={(e) => {
                        setLocation(e.target.value)
                    }}
                    type="text"
                    marginBottom={inputMarginBottom}
                />

                <Flex align="center">
                    <FormLabel marginBottom={labelMarginBottom} marginRight={1}>
                        Email
                    </FormLabel>
                    <Tooltip
                        label="Enter the email address that you would like others to contact you at"
                        fontSize="xs"
                        placement="right"
                        hasArrow
                    >
                        <span>
                            <AiOutlineInfoCircle />
                        </span>
                    </Tooltip>
                </Flex>
                <Input
                    isInvalid={didFocusOnEmail && !emailIsValid}
                    isRequired
                    onFocus={() => {
                        setDidFocusOnEmail(true)
                    }}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                    type="email"
                    marginBottom={inputMarginBottom}
                />

                <Flex align="center">
                    <FormLabel marginBottom={labelMarginBottom} marginRight={1}>
                        Discord ID
                    </FormLabel>
                    <Tooltip
                        label="This does not have to be the same account as the one you signed in with"
                        fontSize="xs"
                        placement="right"
                        hasArrow
                    >
                        <span>
                            <AiOutlineInfoCircle />
                        </span>
                    </Tooltip>
                </Flex>
                <Input
                    isInvalid={didFocusOnDiscordId && !discordIdIsValid}
                    isRequired
                    onFocus={() => {
                        setDidFocusOnDiscordId(true)
                    }}
                    onChange={(e) => {
                        setDiscordId(e.target.value)
                    }}
                    type="text"
                    marginBottom={inputMarginBottom}
                />

                <FormLabel marginBottom={labelMarginBottom}>
                    Preferred Method of Contact
                </FormLabel>
                <Text fontSize="xs">
                    You are not guaranteed to be contacted by your preferred
                    method of contact.
                </Text>
                <RadioGroup
                    defaultValue="email"
                    marginBottom={inputMarginBottom}
                >
                    <HStack spacing="24px">
                        <Radio
                            onChange={(e) => {
                                setMethodOfContact(e.target.value)
                            }}
                            value="email"
                        >
                            Email
                        </Radio>
                        <Radio
                            onChange={(e) => {
                                setMethodOfContact(e.target.value)
                            }}
                            value="discord"
                        >
                            Discord
                        </Radio>
                    </HStack>
                </RadioGroup>

                <Flex align="center">
                    <FormLabel marginBottom={labelMarginBottom} marginRight={1}>
                        Github
                    </FormLabel>
                    <Text fontSize="xs">(recommended)</Text>
                </Flex>
                <Input
                    placeholder="https://github.com/..."
                    onChange={(e) => {
                        setGithubLink(e.target.value)
                    }}
                    type="text"
                    marginBottom={inputMarginBottom}
                    isInvalid={!githubLinkIsValid}
                />
                <Button
                    onClick={
                        formIsValid
                            ? () => {
                                  formSubmit()
                              }
                            : () => {}
                    }
                    isLoading={isLoading}
                    loadingText="Submitting"
                    colorScheme="green"
                    size="lg"
                    width="100%"
                    disabled={!formIsValid || isLoading}
                >
                    Register
                </Button>
            </FormControl>
        </Flex>
    )
}

export default CreateProfile
