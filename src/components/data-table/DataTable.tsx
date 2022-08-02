import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface RowType {
  id: string;
  [key: string]: React.ReactNode;
}

type DataTableProps = {
  rows: RowType[];
  columns: string[];
  ariaLabel: string;
};

const DataTable = ({ rows, columns, ariaLabel }: DataTableProps) => {
  // TODO: ADD PAGINATION

  const hasRows = rows.length > 0;

  return (
    <TableContainer component={Paper}>
      <Table aria-label={ariaLabel}>
        <caption>{ariaLabel}</caption>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column} align="center">
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!hasRows && (
            <TableRow>
              <TableCell align="center" colSpan={columns.length}>
                No data to dispay
              </TableCell>
            </TableRow>
          )}
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={`${row.id}-${column}`} align="center">
                  {row[column]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
