interface PrintTicketProps {
  documentType: string;
  series: string;
  number: string;
  companyName: string;
  companyRuc: string;
  companyAddress: string;
  customerName: string;
  customerDocument?: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  igv: number;
  total: number;
  date: string;
}

export default function PrintTicket({
  documentType, series, number, companyName, companyRuc, companyAddress, customerName, customerDocument, items, subtotal, igv, total, date
}: PrintTicketProps) {
  const fullNumber = `${series}-${number}`;

  return (
    <div className="print-ticket bg-white p-3 sm:p-4 font-mono text-xs text-black w-full max-w-[280px] sm:max-w-[300px] mx-auto">
      <div className="text-center mb-2">
        <h2 className="font-bold text-sm sm:text-base">{companyName}</h2>
        <p className="text-[10px] sm:text-xs">RUC: {companyRuc}</p>
        <p className="text-[10px] sm:text-xs">{companyAddress}</p>
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      <div className="mb-2">
        <p className="font-bold text-center text-sm sm:text-base">{documentType} ELECTRÓNICA</p>
        <p className="text-center text-[10px] sm:text-xs">{fullNumber}</p>
        <p className="text-center text-[10px] sm:text-xs">Fecha: {date}</p>
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      <div className="mb-2">
        <p className="text-[10px] sm:text-xs">Cliente: {customerName}</p>
        {customerDocument && <p className="text-[10px] sm:text-xs">Doc: {customerDocument}</p>}
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      <div className="mb-2">
        <table className="w-full text-[10px] sm:text-xs">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-1">Cant</th>
              <th className="text-left py-1">Desc</th>
              <th className="text-right py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="py-1">{item.quantity}</td>
                <td className="py-1 truncate max-w-[120px]">{item.description}</td>
                <td className="text-right py-1">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      <div className="mb-2 text-right space-y-1 text-[10px] sm:text-xs">
        <div className="flex justify-between">
          <span>Op. Gravada:</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>IGV (18%):</span>
          <span>S/ {igv.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-sm pt-1 border-t border-black mt-1">
          <span>TOTAL:</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      <div className="text-center mt-2 text-[10px] sm:text-xs">
        <p>¡Gracias por su compra!</p>
        <p className="mt-1 text-[9px] sm:text-[10px]">Representación impresa de la {documentType} Electrónica</p>
        <p className="text-[9px] sm:text-[10px]">Autorizado mediante Resolución de Superintendencia</p>
        <div className="mt-2 flex justify-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black"></div>
        </div>
      </div>
    </div>
  );
}
