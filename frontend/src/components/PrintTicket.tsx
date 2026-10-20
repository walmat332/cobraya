interface PrintTicketProps {
  documentType: string;
  series: string;
  number: string;
  customerName: string;
  customerDocument?: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  igv: number;
  total: number;
  date: string;
}

export default function PrintTicket({
  documentType, series, number, customerName, customerDocument, items, subtotal, igv, total, date
}: PrintTicketProps) {
  const fullNumber = `${series}-${number}`;

  return (
    <div className="print-ticket bg-white p-4 font-mono text-xs text-black max-w-[80mm] mx-auto">
      {/* Encabezado */}
      <div className="text-center mb-2">
        <h2 className="font-bold text-sm">COBRAYA S.A.C.</h2>
        <p>RUC: 20123456789</p>
        <p>Av. Ejemplo 123, Lima</p>
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      {/* Datos del Comprobante */}
      <div className="mb-2">
        <p className="font-bold text-center text-sm">{documentType} ELECTRÓNICA</p>
        <p className="text-center">{fullNumber}</p>
        <p className="text-center">Fecha: {date}</p>
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      {/* Datos del Cliente */}
      <div className="mb-2">
        <p>Cliente: {customerName}</p>
        {customerDocument && <p>Doc: {customerDocument}</p>}
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      {/* Items */}
      <div className="mb-2">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left">Cant</th>
              <th className="text-left">Desc</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.quantity}</td>
                <td className="truncate">{item.description}</td>
                <td className="text-right">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      {/* Totales */}
      <div className="mb-2 text-right space-y-1">
        <div className="flex justify-between">
          <span>Op. Gravada:</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>IGV (18%):</span>
          <span>S/ {igv.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-sm">
          <span>TOTAL:</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      {/* Pie de página */}
      <div className="text-center mt-2">
        <p>¡Gracias por su compra!</p>
        <p className="mt-1 text-[10px]">Representación impresa de la {documentType} Electrónica</p>
        <p className="text-[10px]">Autorizado mediante Resolución de Superintendencia</p>
        
        {/* QR Simulado */}
        <div className="mt-2 flex justify-center">
          <div className="w-16 h-16 bg-black"></div>
        </div>
      </div>
    </div>
  );
}
