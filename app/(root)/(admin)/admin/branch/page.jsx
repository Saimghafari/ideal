'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import EditAction from "@/components/Application/Admin/EditAction"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DT_BRANCH_COLUMN } from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import { ADMIN_BRANCH_ADD, ADMIN_BRANCH_EDIT, ADMIN_BRANCH_SHOW, ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute"
import Link from "next/link"
import { useCallback, useMemo } from "react"
import { FiPlus } from "react-icons/fi"

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_BRANCH_SHOW, label: 'Branches' },
]

const ShowBranch = () => {
  const columns = useMemo(() => columnConfig(DT_BRANCH_COLUMN), [])

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <EditAction key="edit" href={ADMIN_BRANCH_EDIT(row.original._id)} />,
      <DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />,
    ]
  }, [])

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">Branches</h4>
            <Button>
              <FiPlus />
              <Link href={ADMIN_BRANCH_ADD}>New Branch</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <DatatableWrapper
            queryKey="branch-data"
            fetchUrl="/api/branch"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/branch/export"
            deleteEndpoint="/api/branch/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=branch`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ShowBranch
