
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  TablePagination,
  CircularProgress,
  Typography
} from '@mui/material';

const DataTable = ({ 
  columns, 
  data, 
  isLoading, 
  totalCount, 
  page, 
  rowsPerPage, 
  onPageChange, 
  onRowsPerPageChange 
}) => {

  return (
    <Paper className="w-full overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <TableContainer className="max-h-[600px]">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell 
                  key={col.id} 
                  align={col.align || 'left'}
                  style={{ minWidth: col.minWidth }}
                  className="bg-gray-50 dark:bg-gray-900 dark:text-gray-200 font-semibold border-b dark:border-gray-700"
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" className="py-10 border-b dark:border-gray-700">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" className="py-10 border-b dark:border-gray-700 dark:text-gray-400">
                  <Typography variant="body1">No records found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id || index} className="dark:hover:bg-gray-700/50">
                    {columns.map((col) => {
                      const value = row[col.id];
                      return (
                        <TableCell key={col.id} align={col.align || 'left'} className="dark:text-gray-300 border-b dark:border-gray-700">
                          {col.format ? col.format(value, row) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {onPageChange && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={totalCount || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          className="dark:text-gray-300 border-t dark:border-gray-700"
        />
      )}
    </Paper>
  );
};

export default DataTable;
