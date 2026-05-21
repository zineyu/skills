// Test Doubles and TDD Example (TypeScript)

// Domain
export interface EmailService {
  send(email: Email): Promise<void>
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  save(user: User): Promise<void>
}

export class Email {
  constructor(
    readonly to: string,
    readonly subject: string,
    readonly body: string
  ) {
    if (!to.includes('@')) throw new Error('Invalid email')
  }
}

export class User {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
    readonly isVerified: boolean = false
  ) {}

  verify(): User {
    return new User(this.id, this.email, this.name, true)
  }
}

// Test Doubles

export class MockEmailService implements EmailService {
  private sentEmails: Email[] = []

  async send(email: Email): Promise<void> {
    this.sentEmails.push(email)
  }

  assertEmailSent(expected: Partial<Email>): void {
    const found = this.sentEmails.some(e =>
      (!expected.to || e.to === expected.to) &&
      (!expected.subject || e.subject === expected.subject)
    )
    if (!found) {
      throw new Error(`Expected email not sent: ${JSON.stringify(expected)}`)
    }
  }

  getSentEmails(): Email[] {
    return [...this.sentEmails]
  }
}

export class FakeUserRepository implements UserRepository {
  private users: Map<string, User> = new Map()

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user
    }
    return null
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user)
  }

  addUser(user: User): void {
    this.users.set(user.id, user)
  }
}

// Use Case

export class RegisterUserCommand {
  constructor(
    readonly email: string,
    readonly name: string
  ) {}
}

export class RegisterUserResult {
  constructor(
    readonly success: boolean,
    readonly userId?: string,
    readonly error?: string
  ) {}
}

export class RegisterUserUseCase {
  constructor(
    private userRepo: UserRepository,
    private emailService: EmailService
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    // Validate email format
    try {
      new Email(command.email, '', '')
    } catch {
      return new RegisterUserResult(false, undefined, 'Invalid email format')
    }

    // Check if user exists
    const existing = await this.userRepo.findByEmail(command.email)
    if (existing) {
      return new RegisterUserResult(false, undefined, 'Email already registered')
    }

    // Create user
    const userId = `user-${Date.now()}`
    const user = new User(userId, command.email, command.name)
    await this.userRepo.save(user)

    // Send welcome email
    const welcomeEmail = new Email(
      command.email,
      'Welcome!',
      `Hello ${command.name}, welcome to our platform!`
    )
    await this.emailService.send(welcomeEmail)

    return new RegisterUserResult(true, userId)
  }
}

// Tests (using Jest)

import { describe, it, expect, beforeEach } from '@jest/globals'

describe('RegisterUserUseCase', () => {
  let userRepo: FakeUserRepository
  let emailService: MockEmailService
  let useCase: RegisterUserUseCase

  beforeEach(() => {
    userRepo = new FakeUserRepository()
    emailService = new MockEmailService()
    useCase = new RegisterUserUseCase(userRepo, emailService)
  })

  it('registers new user successfully', async () => {
    const command = new RegisterUserCommand('alice@example.com', 'Alice')

    const result = await useCase.execute(command)

    expect(result.success).toBe(true)
    expect(result.userId).toBeDefined()
  })

  it('sends welcome email after registration', async () => {
    const command = new RegisterUserCommand('alice@example.com', 'Alice')

    await useCase.execute(command)

    emailService.assertEmailSent({
      to: 'alice@example.com',
      subject: 'Welcome!'
    })
  })

  it('rejects invalid email format', async () => {
    const command = new RegisterUserCommand('invalid-email', 'Alice')

    const result = await useCase.execute(command)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid email format')
  })

  it('rejects duplicate email', async () => {
    userRepo.addUser(new User('existing-id', 'alice@example.com', 'Alice'))
    const command = new RegisterUserCommand('alice@example.com', 'Alice')

    const result = await useCase.execute(command)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Email already registered')
  })
})