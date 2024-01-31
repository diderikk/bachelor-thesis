import { DataGrid, GridCallbackDetails, GridSelectionModel, GridToolbar } from '@mui/x-data-grid';
import { useState } from 'react';
import { IdDataGridData } from '../interfaces/ui/IdDataGridData.interface';

/**
 * Displays the ID data in a material ui data grid.
 * With some internal configuration done to it.
 * @param data Is the Id cards to be displayed.
 * @param setSelected Is a callback function to be run when changing the selected rows in the data grid.
 * @param loading Boolean tells if the the grid shoudl display a loading spinner
 */
const IdDataGrid = ({data, setSelected, loading}: {data: IdDataGridData[], setSelected: (idValues: string[]) => void, loading: boolean}) => {
    const [pageSize, setPageSize] = useState(5)

    const columns = [{
        field: "id", headerName: "ID", width: 200
    },
    {
        field: "personalId", headerName: "Personal ID", width: 120
    },
    {
        field: "forename", headerName: "Forename", width: 160
    },
    {
        field: "surname", headerName: "Surname", width:160
    },
    {
        field: "expirationDate", headerName: "Expiration date", width: 240
    }
]
    return (
        <DataGrid getRowId={row => row.id} 
        rows={data} columns={columns} loading={loading} 
        checkboxSelection
        components={{Toolbar: GridToolbar}}
        onSelectionModelChange={(selectionModel: GridSelectionModel, _: GridCallbackDetails) => {
            setSelected(selectionModel as string[])
        }}
        autoHeight
        pageSize={pageSize}
        onPageSizeChange={(page:number) => {setPageSize(page)}}
        rowsPerPageOptions={[5,10,25, 50, 100]}
        />
    )
}

export default IdDataGrid