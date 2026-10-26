import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import { ROUTES } from "./routes"
import { AppRoot } from "./AppRoot"
import * as Sentry from "@sentry/react"
import Contracts from "../screens/contracts"
import Root from "../screens"
import Directory from "../screens/directory"
import EscrowOffers from "../screens/escrowOffers"

const sentryCreateBrowserRouter = Sentry.wrapCreateMemoryRouterV6(createBrowserRouter)

export const Router = sentryCreateBrowserRouter(
    createRoutesFromElements(
        <Route path={ROUTES.ROOT} element={<AppRoot />}>
            <Route path={ROUTES.ROOT} element={<Root />} />
            <Route path={ROUTES.DIRECTORY} element={<Directory />}>
                <Route path={`${ROUTES.CONTRACTS}`} element={<Contracts />} />
                <Route path={ROUTES.ESCROW_OFFERS} element={<EscrowOffers />} />
            </Route>
        </Route>
    )
)
