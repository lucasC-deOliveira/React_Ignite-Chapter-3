import { render, screen } from "@testing-library/react"
import { mocked } from "ts-jest/utils"
import Home, { getStaticProps } from '../../pages'
import { stripe } from "../../services/stripe"

jest.mock('next/router')
jest.mock('next-auth/react', () => {
  return {
    useSession: () => {
      return { data: null, status: 'unauthenticated' }
    }
  }
})

jest.mock('../../services/stripe')

describe("Home page", () => {
  it("renders correctly", () => {

    render(<Home product={{
      priceId: "fake-price-id",
      amount: "R$10,00"
    }} />)

    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument()
  })

  it("load initial data", async () => {
    const retrieveStripeMocked = mocked(stripe.prices.retrieve)

    retrieveStripeMocked.mockResolvedValueOnce({ id: "fake", unit_amount: 1000 } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(expect.objectContaining({
      props: {
        product: {
          amount: 'R$\xa010,00',
          priceId: 'fake',
        },
      },
      revalidate: 86400,
    }))

  })
})