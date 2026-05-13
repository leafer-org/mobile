import { createContext, useContext } from "react";

export type OrganizationId = string;
export const OrganizationContext = createContext<OrganizationId | null>(null)


export function useCurrentOrganizationId() {
    const organizationId = useContext(OrganizationContext);

    if (!organizationId) {  
        throw new Error("useOrganizationId must be used within an OrganizationContext.Provider");
    }

    return organizationId;
}

export function CurrentOrganizationProvider({ organizationId, children }: { organizationId: OrganizationId; children: React.ReactNode }) {
    return (
        <OrganizationContext.Provider value={organizationId}>   
            {children}
        </OrganizationContext.Provider>
    );
}   