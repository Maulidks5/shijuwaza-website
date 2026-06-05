export default function AdminTable({ columns, children }) {
    return (
        <div className="admin-table overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md sm:rounded-2xl">
            <table className="w-full min-w-[680px] text-left sm:min-w-[760px]">
                <thead className="bg-[#F8FAFC] text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                        {columns.map((column) => (
                            <th key={column} className="px-5 py-4">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">{children}</tbody>
            </table>
        </div>
    );
}
