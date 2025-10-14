# Contributing

Thank you for your interest in contributing to the LLVM TypeScript Bindings! This project provides TypeScript bindings for the LLVM API using Bun's FFI.

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) (latest version)
- LLVM development libraries (version 21.x.x)
- TypeScript 5.x

### Installation

1. Install LLVM on your system:
   - **macOS**: `brew install llvm@21`
   - **Ubuntu/Debian**: `sudo apt-get install llvm-21-dev`
   - **Arch Linux**: `sudo pacman -S llvm21`

2. Clone the repository and install dependencies:
   ```bash
   git clone <repository-url>
   cd llvm-bindings-bun
   bun install
   ```

3. Run tests to verify your setup:
   ```bash
   bun test
   ```

### Environment Variables

If LLVM is not automatically detected on your system, you can specify the LLVM library directory:

```bash
export LLVM_LIB_DIR=/path/to/llvm/lib
```

This is particularly useful for:
- Custom LLVM installations
- Non-standard LLVM paths
- Systems where LLVM is installed in a non-default location
- Development environments with multiple LLVM versions

## Contribution Guidelines

### Code Style

- Use TypeScript with strict type checking
- Follow the existing code patterns in the `src/` directory
- Use descriptive names for FFI bindings and TypeScript wrappers
- Add JSDoc comments for public APIs
- Keep FFI bindings in `src/symbols/` and TypeScript wrappers in `src/modules/`

### Testing

- Add tests for new functionality in the `test/` directory
- Ensure all tests pass: `bun test`

### FFI Binding Guidelines

- When adding new LLVM C API functions, add them to the appropriate symbols file in `src/symbols/`
- Create TypeScript wrappers in `src/modules/` that provide a more idiomatic TypeScript API
- Handle memory management properly - LLVM objects should be automatically disposed
- Follow the existing pattern of using Bun's FFI for C library binding

### Pull Request Process

1. Fork the repository and create a feature branch
2. Make your changes following the code style guidelines
3. Add tests for new functionality
4. Ensure all tests pass: `bun test`
5. Update documentation if you've changed the public API
6. Submit a pull request with a clear description of your changes

### Review Process

- All pull requests require at least one review
- Ensure CI tests pass before requesting review
- Address feedback promptly and keep discussions constructive

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at hassanalinali@gmail.com. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/