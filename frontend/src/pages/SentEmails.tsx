import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function SentEmails() {
  const location = useLocation();
  const navigate = useNavigate();
  const sentData = location.state?.sentData || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Sent Emails</h2>
      {sentData.length === 0 ? (
        <p>No emails were sent.</p>
      ) : (
        <table className="w-full border rounded">
          <thead className="bg-secondary">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Company</th>
              <th className="p-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {sentData.map((emp: any) => (
              <tr key={emp.email}>
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.email}</td>
                <td className="p-2">{emp.company}</td>
                <td className="p-2 whitespace-pre-wrap">{emp.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Button className="mt-4" onClick={() => navigate(-1)}>
        Back
      </Button>
    </div>
  );
}
