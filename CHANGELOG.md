# Changelog

## [v4.1.0](https://github.com/combine/objection-auth/tree/v4.1.0)
### Changed
- Detected hashes now resolves to the original hash rather than throwing an
  error by default. To throw an error, turn on `strict` mode.

## [v4.0.0](https://github.com/combine/objection-auth/tree/v4.0.0)

- Deprecate Tokenable.

## [v3.0.1](https://github.com/combine/objection-auth/tree/v3.0.0)

- Set options to minutes instead of seconds.

## [v3.0.0](https://github.com/combine/objection-auth/tree/v3.0.0)

- **BREAKING**: Minor refactor of option names. Technically breaking, so bump
  to v3.

## [v2.0.0](https://github.com/combine/objection-auth/tree/v2.0.0)

- **BREAKING**: Properly implement plugins as class mixins.

## [v1.0.2](https://github.com/combine/objection-auth/tree/v1.0.2)

- Return a promise when hashing.

## [v1.0.1](https://github.com/combine/objection-auth/tree/v1.0.1)

- Remove cookie settings as this should be done outside of this package.

## [v1.0.0](https://github.com/combine/objection-auth/tree/v1.0.0)

- Initial version.
