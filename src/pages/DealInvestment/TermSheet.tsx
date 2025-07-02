import { useParams } from "react-router-dom";

function TermSheet() {
    const { dealId, investmentAmount } = useParams<{ dealId: string; investmentAmount: string }>();
  return (
    <div>TermSheet - {dealId} - {investmentAmount}</div>
  )
}

export default TermSheet