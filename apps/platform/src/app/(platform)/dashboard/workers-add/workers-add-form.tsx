import { UseFormRegister } from "react-hook-form";
import { WorkersAddFormSchemaType } from ".";

import { FormField } from "@civalgo/ui/field";

type WorkersAddFormProps = {
  onSubmit: (data: WorkersAddFormSchemaType) => Promise<void>;
  register: UseFormRegister<WorkersAddFormSchemaType>;
};

export default function WorkersAddForm({ register }: WorkersAddFormProps) {
  return (
    <div className="w-full flex flex-col justify-start items-start">
      <div className="flex w-full flex-col justify-start items-start space-y-3">
        <FormField
          id="name"
          registration={register("name")}
          label="Worker Name"
          labelClassName="-mb-0.5"
          placeholder="Enter worker name"
        />
        <FormField
          id="email"
          registration={register("email")}
          label="Email"
          labelClassName="-mb-0.5"
          placeholder="Enter worker email"
        />
        <FormField
          id="phone"
          registration={register("phone")}
          label="Phone"
          labelClassName="-mb-0.5"
          placeholder="Enter worker phone number"
        />
      </div>
    </div>
  );
}
