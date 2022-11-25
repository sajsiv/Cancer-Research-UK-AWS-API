export type GetUserByEmailEvent = {
    info: {
      fieldName: string
    },
    arguments: {
      email: string
    }
}

export type PostUserEvent = {
    user: {
      email_address: string,
      donation: boolean
    }
}