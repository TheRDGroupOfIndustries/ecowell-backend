//@ts-nocheck
import { capitalizeHeader } from "@/lib/utils";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});

const Datatable = ({
  showId = true,
  myData,
  myClass,
  multiSelectOption,
  pagination,
  isEditable,
  isDelete,
  handleOnClick,
  onClickField,
  loading,
  onDelete,
  handleOpenEditModal,
}: any) => {
  useEffect(() => {
    setData(myData);
    // console.log("myData", myData);
  }, [myData]);

  const [checkedValues, setCheckedValues] = useState([]);
  const [data, setData] = useState(myData);

  const selectRow = (e, i) => {
    if (!e.target.checked) {
      setCheckedValues(checkedValues.filter((item, j) => i !== item));
    } else {
      checkedValues.push(i);
      setCheckedValues(checkedValues);
    }
  };

  const handleRemoveRow = () => {
    const updatedData = myData.filter(function (el) {
      return checkedValues.indexOf(el.id) < 0;
    });
    setData([...updatedData]);
    toast.success("Successfully Deleted !");
  };

  const renderEditable = (cellInfo) => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          data[cellInfo.index][cellInfo.index.id] = e.target.innerHTML;
          setData({ myData: data });
        }}
        dangerouslySetInnerHTML={{
          __html: myData[cellInfo.index][cellInfo.index.id],
        }}
      />
    );
  };

  const handleDelete = async (index: number, row: any) => {
    if (window.confirm("Are you sure you wish to delete this item?")) {
      const del = data;
      del.splice(index, 1);
      if (onDelete) {
        const hasDeleted = await onDelete(row);
        console.log("hasDeleted: ", hasDeleted);
        if (hasDeleted) setData([...del]);
      } else {
        toast.error("On Delete function is not defined!");
      }
    }
  };

  const Capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const columns = [];
  for (const key in myData[0]) {
    if (key === "_id" && !showId) {
      continue;
    }

    let editable = renderEditable;
    if (key === "image") {
      editable = null;
    }
    if (key === "status") {
      editable = null;
    }
    if (key === "avtar") {
      editable = null;
    }
    if (key === "profile_image") {
      editable = null;
    }
    if (key === "vendor") {
      editable = null;
    }
    if (key === "order_status") {
      editable = null;
    }

    columns.push({
      name: <b>{capitalizeHeader(key.toString())}</b>,
      header: <b>{capitalizeHeader(key.toString())}</b>,
      selector: (row) => {
        if (typeof row[key] === "object" && row[key] !== null) {
          return JSON.stringify(row[key]);
        }
        if (key === "price" || key === "salePrice") {
          return `₹${Number(row[key]).toLocaleString("en-IN")}`;
        }
        // Add number formatting for numeric fields
        if (typeof row[key] === "number") {
          return row[key].toLocaleString("en-IN");
        }
        return row[key];
      },
      cell: (row) => {
        if (
          key === "image_link" ||
          key === "profile_image" ||
          key === "image"
        ) {
          return (
            <div style={{ textAlign: "center" }}>
              <Image
                src={row[key]}
                alt="Image"
                width={100}
                height={80}
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
              />
            </div>
          );
        }
        if (key === "price" || key === "salePrice") {
          return <div>₹{Number(row[key]).toLocaleString("en-IN")}</div>;
        }
        // Add number formatting for numeric fields
        if (typeof row[key] === "number") {
          return <div>{row[key].toLocaleString("en-IN")}</div>;
        }
        if (key === onClickField) {
          return (
            <div
              style={{
                cursor: "pointer",
                color: "blue",
                textDecorationLine: "underline",
              }}
              onClick={() => handleOnClick(row)}
            >
              {row[key]}
            </div>
          );
        }
        return row[key] || "-";
      },
      Cell: editable,
      style: {
        textAlign: "center",
      },
    });
  }

  if (multiSelectOption === true) {
    columns.push({
      name: (
        <Button
          color="danger"
          size="sm"
          className=" btn-delete mb-0 b-r-4"
          onClick={(e) => {
            if (window.confirm("Are you sure you wish to delete this item?"))
              handleRemoveRow();
          }}
        >
          Delete
        </Button>
      ),
      id: "delete",
      accessor: () => "delete",
      cell: (row) => (
        <div>
          {row.role !== "super-admin" && (
            <span>
              <Input
                type="checkbox"
                name={row.id}
                defaultChecked={checkedValues.includes(row.id)}
                onChange={(e) => selectRow(e, row.id)}
              />
            </span>
          )}
        </div>
      ),
      style: {
        textAlign: "center",
      },
      sortable: false,
    });
  } else if (isEditable || isDelete) {
    columns.push({
      name: <b>Action</b>,
      id: "delete",
      accessor: (str) => "delete",
      cell: (row, index) => (
        <div>
          {isDelete && row.role !== "super-admin" && (
            <span onClick={() => handleDelete(index, row)}>
              <i
                className="fa fa-trash"
                style={{
                  width: 35,
                  fontSize: 20,
                  padding: 11,
                  color: "#e4566e",
                  cursor: "pointer",
                }}
              ></i>
            </span>
          )}
          {isEditable && (
            <span>
              <i
                onClick={() => {
                  if (handleOpenEditModal) {
                    handleOpenEditModal(row);
                  } else {
                    toast.error("Edit function is not defined!");
                  }
                }}
                className="fa fa-pencil"
                style={{
                  width: 35,
                  fontSize: 20,
                  padding: 11,
                  color: "rgb(40, 167, 69)",
                  cursor: "pointer",
                }}
              ></i>
            </span>
          )}
        </div>
      ),
      style: {
        textAlign: "center",
      },
      sortable: false,
    });
  }

  useEffect(() => {
    console.log("loading: ", loading);
  }, [loading]);

  return (
    <div>
      <Fragment>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <DataTable
            data={data}
            columns={columns}
            className={myClass}
            pagination={pagination}
            striped={true}
            center={true}
          />
        )}
        <ToastContainer />
      </Fragment>
    </div>
  );
};

export default Datatable;
