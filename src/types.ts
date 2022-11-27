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
      donations: Array<Donation>
    }
}

export type PostDonationEvent = {
  donation: {
    email_address: string,
    amount: number
  }
}

export type Donation = {
  date: string,
  amount: number 
}