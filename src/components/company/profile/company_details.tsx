import { CompanyDetails } from "@/interfaces/company";


export default function CompanyDetailsComponent({company}:{company:CompanyDetails}){

    return (
        <table className="mb-12">
            <tr>
                <td className="py-2">Name:</td>
                <td className="p-2">{company.name}</td>
            </tr>
            <tr>
                <td className="py-2">BRN</td>
                <td className="py-2">{company.brn}</td>
            </tr>
            <tr>
                <td className="py-2">Address</td>
                <td className="py-2">{company.address}</td>
            </tr>
            <tr>
                <td className="py-2">Phone</td>
                <td className="py-2">
                    <ul>
                        {
                            company.phone.map((phone, index) => (
                                <li key={index}>{phone}</li>
                            ))
                        }
                    </ul>
                </td>
            </tr>
            <tr>
                <td className="py-2">Email</td>
                <td className="py-2">{company.email}</td>
            </tr>
        </table>
    )
}