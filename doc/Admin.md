# Admin

This component renders an Admin page
The page is used to manage users and see their services

## Data

| Name        | Type      | Description | Initial value |
| ----------- | --------- | ----------- | ------------- |
| `value`     | `string`  |             | `""`          |
| `connected` | `boolean` |             | `false`       |
| `error`     | `string`  |             | `""`          |
| `userList`  | `array`   |             | `[]`          |

## Methods

### getUsers()

This function is used to retreive all the users of the Dashboard
It also checks for the servicies of the users

**Syntax**

```typescript
getUsers(): void
```

