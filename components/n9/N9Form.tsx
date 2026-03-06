'use client';

export interface N9FormProps {
  landlordName?: string;
  tenantName?: string;
  rentalAddress?: string;
  terminationDate?: string;
  phoneNumber?: string;
  signatureFirstName?: string;
  signatureLastName?: string;
  showSignatureSection?: boolean;
}

export function N9Form({
  landlordName = '',
  tenantName = '',
  rentalAddress = '',
  terminationDate = '',
  phoneNumber = '',
  signatureFirstName = '',
  signatureLastName = '',
  showSignatureSection = false,
}: N9FormProps) {
  return (
    <div className="max-w-[612px] border border-border bg-white p-8 font-sans text-sm print:border-0 print:shadow-none">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-lg font-bold">Tenant&apos;s Notice to End the Tenancy</h1>
        <p className="text-base font-bold">N9</p>
        <p className="text-xs text-muted-foreground">(Disponible en français)</p>
      </div>

      {/* To / From */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-normal">To: (Landlord&apos;s name)</p>
          <p className="min-h-[2rem] border-b border-black py-1">{landlordName}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-normal">From: (Tenant&apos;s name) include all tenant names</p>
          <p className="min-h-[2rem] border-b border-black py-1">{tenantName}</p>
        </div>
      </div>

      {/* Address */}
      <div className="mb-6 space-y-1">
        <p className="text-xs font-normal">Address of the Rental Unit:</p>
        <p className="min-h-[2rem] border-b border-black py-1">{rentalAddress}</p>
      </div>

      {/* Termination statement */}
      <p className="mb-4 font-bold">
        I am giving this notice because I want to move out of the rental unit.
      </p>

      <p className="mb-2 font-bold">
        The last day of my tenancy will be{' '}
        <span className="inline-block min-w-[8rem] border-b border-black align-bottom px-2">
          {terminationDate || 'dd/mm/yyyy'}
        </span>
        . This is the termination date.
      </p>
      <p className="mb-1 text-xs text-muted-foreground">dd/mm/yyyy</p>

      <p className="mb-8 font-bold">
        I will move out of the rental unit on or before the termination date.
      </p>

      {/* Important Information */}
      <div className="space-y-4 rounded bg-muted/50 p-4 text-xs">
        <h2 className="text-center font-bold">Important Information from the Landlord and Tenant Board</h2>

        <div>
          <p className="font-bold">The termination date</p>
          <p className="mt-1">
            For most types of tenancies (including monthly tenancies) the termination date must be at
            least 60 days after the tenant gives the landlord this notice. Also, the termination date
            must be the last day of the rental period. For example, if the tenant pays on the first day
            of each month, the termination date must be the last day of the month. If the tenancy is
            for a fixed term (for example, a lease for one year), the termination date cannot be earlier
            than the last date of the fixed term.
          </p>
        </div>

        <div>
          <p className="font-bold">Exceptions:</p>
          <ul className="mt-1 list-disc pl-5 space-y-1">
            <li>
              The termination date must be at least 28 days after the tenant gives the landlord this
              notice if the tenancy is daily or weekly (the tenant pays rent daily or weekly). Also, the
              termination date must be the last day of the rental period.
            </li>
            <li>
              The termination date can be earlier than the last day of a fixed term tenancy (but still
              must be the last day of a rental period) if the tenant is giving this notice because:
              the tenancy agreement was entered into on or after April 30, 2018; the landlord was
              required to use the Residential Tenancy Agreement (Standard Form of Lease) form but did
              not; the tenant demanded in writing that the landlord give them this form, and either more
              than 21 days have passed and the landlord has not provided the form, or the landlord
              provided the form less than 30 days ago but it was not signed by the tenant.
            </li>
            <li>
              A special rule allows less than 60 days&apos; notice in situations where the tenant would
              normally be required to give 60 days notice. The tenant can give notice for the end of
              February no later than January 1st and can give notice for the end of March no later than
              February 1st.
            </li>
          </ul>
        </div>

        <div>
          <p className="font-bold">The landlord can apply to end the tenancy</p>
          <p className="mt-1">
            The landlord can apply to the Board for an order to end the tenancy and evict the tenant
            as soon as the tenant gives the landlord this notice. However, if the Board issues an order
            ending the tenancy, the order will not require the tenant to move out any earlier than the
            termination date the tenant included in this notice.
          </p>
        </div>
      </div>

      {/* Signature section (Page 3 of official form) */}
      {showSignatureSection && (
        <div className="mt-8 space-y-4 border-t border-border pt-6">
          <p className="font-bold">Signature</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-normal">First Name</p>
              <p className="min-h-[2rem] border-b border-black py-1">{signatureFirstName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-normal">Last Name</p>
              <p className="min-h-[2rem] border-b border-black py-1">{signatureLastName}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-normal">Phone Number</p>
            <p className="min-h-[2rem] border-b border-black py-1">{phoneNumber || '—'}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex justify-between text-xs text-muted-foreground">
        <span>v. 01/04/2022</span>
        <span>Page 1 of 3</span>
      </div>
    </div>
  );
}
