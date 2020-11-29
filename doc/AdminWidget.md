# Adminwidget

This widget is used on the Admin page to render a user
and its services

## Props

| Name           | Type      | Description |
| -------------- | --------- | ----------- |
| `name-prop`    | `String`  |             |
| `imgurbool`    | `Boolean` |             |
| `spotifybool`  | `Boolean` |             |
| `youtubebool`  | `Boolean` |             |
| `weatherbool`  | `Boolean` |             |
| `currencybool` | `Boolean` |             |
| `user-id`      | `String`  |             |
| `id-prop`      | `Number`  | &nbsp;      |

## Data

| Name         | Type     | Description | Initial value |
| ------------ | -------- | ----------- | ------------- |
| `valueParam` | `string` |             | `""`          |

## Methods

### deleteUser()

This function is used to delete an user

**Syntax**

```typescript
deleteUser(): void
```

