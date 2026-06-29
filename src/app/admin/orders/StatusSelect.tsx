"use client";

import { useRouter } from "next/navigation";

export default function StatusSelect({
  orderId,
  status,
}:{
  orderId:number;
  status:string;
}){

  const router = useRouter();

  async function handleChange(
    e:React.ChangeEvent<HTMLSelectElement>
  ){

    await fetch(
      `/api/admin/orders/${orderId}`,
      {
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          status:e.target.value,
        }),
      }
    );

    router.refresh();
  }

  return(

    <select
      defaultValue={status}
      onChange={handleChange}
      className="border rounded-lg px-3 py-2"
    >

      <option>Pending</option>

      <option>Processing</option>

      <option>Shipped</option>

      <option>Completed</option>

      <option>Cancelled</option>

    </select>

  );

}