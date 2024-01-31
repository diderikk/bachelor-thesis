import { Button, Grid, TextField, Tooltip } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import IdDataGrid from "../../components/IdDataGrid";
import ENV from "../../config/env";
import { useSnackBar } from "../../context/SnackBarContext";
import {
  IdDataGridData,
  toIdDataGridData
} from "../../interfaces/ui/IdDataGridData.interface";

/**
 * Fetches users from the server hosted at host.
 * @param protocol The protocol to be used e.g., https.
 * @param url The url to get users from e.g., localhost:3000.
 * @returns An object consisting of an http status and either the raw data (stored as data) or the ids mapped from the data (stored as ids).
 */
const fetchUsers = async (protocol: string, url: string) => {
  const response = await fetch(`${protocol}://${url}/api/v1/users`);
  const data = await response.json();
  if (!response.ok) {
    return { status: response.status, data };
  }
  const ids: IdDataGridData[] = data.map(toIdDataGridData);
  return {
    status: response.status,
    ids,
  };
};

/**
 * Loads the users from fetchUsers before the AdministerIds page is rendered.
 * @returns Either the users' ids, along with protocol and url to use when reloading. Or an object containing null for all values.
 */
export async function getServerSideProps() {
  //Meaning that the server fetches users form itself.
  const res = await fetchUsers(ENV.PROTOCOL, ENV.SERVER_URL);
  if (res.status !== 200) {
    return {
      props: {
        ids: null,
        protocol: null,
        url: null
      },
    };
  }
  return {
    props: {
      ids: res.ids,
      protocol: ENV.PROTOCOL,
      url: ENV.SERVER_URL
    },
  };
}

/**
 * An overview for administering users.
 * @param ids The users' ids. Containing data such as forename.
 * @param protocol The protocol to be used when reloading users e.g., https.
 * @param url The url to reload users from e.g., localhost:3000.
 * @returns An overview (including searching, sorting and filtering) off all users. With buttons to create new ones, edit or delete existing.
 */
const AdministerIds = ({
  ids,
  protocol,
  url
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { dispatch } = useSnackBar();

  const [selectedIds, setSelectedIds] = useState([] as string[]);
  const [search, setSearch] = useState("");
  //datasource is the data received from the server at rendering or reload.
  const [dataSource, setDataSource] = useState(ids as IdDataGridData[]);
  //data is the data sent to the DataGrid, it can be equal to dataSource or filtered by a search.
  const [data, setData] = useState(dataSource as IdDataGridData[]);
  const [loading, setLoading] = useState(false);

  //The search functionality
  useEffect(() => {
    if (search.length <= 0) {
      setData(dataSource as IdDataGridData[]);
      return;
    }
    setLoading(true);
    const list = [] as IdDataGridData[];
    for (const obj of dataSource as IdDataGridData[]) {
      for (const key in obj) {
        const data = obj[key as keyof IdDataGridData];
        if (
          typeof data === "string" &&
          data.toLowerCase().includes(search.toLocaleLowerCase()) &&
          !list.some((o) => o.id === obj.id)
        ) {
          list.push(obj);
          //Breaking to not test rest of objects properties if already found in one of them
          break;
        }
      }
    }
    setData(list);
    setLoading(false);
  }, [dataSource, search]);

  const editSelected = () => {
    router.push(`/ids/${selectedIds[0]}/edit`);
  };

  //Sending error if users could not be fetched.
  if (!ids || !protocol || !url) {
    dispatch({ type: "error", error: "Could not fetch users." });
    return;
  }

  const handleDelete = async () => {
    setLoading(true);
    const deleteRes = await fetch("/api/v1/users", {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: selectedIds }),
    });
    if (!deleteRes.ok) {
      dispatch({ type: "error", error: "User could not be deleted." });
      setLoading(false)
      return;
    }
    dispatch({ type: "success", description: "User was deleted." });

    //Reloading users
    const getRes = await fetchUsers(protocol, url);
    setLoading(false);
    if (getRes.status !== 200) {
      dispatch({ type: "error", error: "Could not reload users." });
      return;
    }
    setData(getRes.ids ?? []);
    setDataSource(getRes.ids ?? []);
  };

  

  //Needed to add span around button inside tooltip because of the way Material UI is built
  return (
    <Grid container style={{ marginTop: "20px" }} alignItems="center">
      <Grid item xs={8}>
        <TextField
          variant="outlined"
          label="Search"
          size="small"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={true}></Grid>
      <Grid item xs={1} justifyContent="flex-end">
        <Button
          fullWidth
          variant="contained"
          style={{
            backgroundColor: "lightgreen",
            color: "white",
            height: "100%",
          }}
          onClick={() => router.push("/ids/create")}
        >
          +
        </Button>
      </Grid>
      <Grid item xs={12} style={{ marginTop: "10px" }}>
        <IdDataGrid
          data={data}
          setSelected={setSelectedIds}
          loading={loading}
        />
      </Grid>
      <Grid item xs={1.25} style={{ marginTop: "10px" }}>
        <Tooltip title="Select one item only">
          <span>
            <Button
              variant="contained"
              onClick={editSelected}
              disabled={selectedIds.length !== 1}
              style={{ color: "white" }}
            >
              Edit selected
            </Button>
          </span>
        </Tooltip>
      </Grid>
      <Grid item xs={1.5} style={{ marginTop: "10px" }}>
        <Tooltip title="Select at least one item">
          <span>
            <Button
              variant="contained"
              color="error"
              disabled={selectedIds.length < 1}
              style={{ color: "white", height: "100%" }}
              onClick={handleDelete}
            >
              Delete selected
            </Button>
          </span>
        </Tooltip>
      </Grid>
    </Grid>
  );
};
export default AdministerIds;
