import CreateForm from "./create-form";

export default async function CreateWorkspacePage() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full flex flex-col max-w-[320px] p-0.5 relative border border-gray-200 bg-gray-950/3 flex-1 rounded-md justify-start items-start">
        <div className="w-full flex flex-col space-y-1.5 p-2 justify-start items-start">
          <h1 className="text-md font-sans! font-medium">
            Create a new workspace
          </h1>
          <p className="text-xs font-sans font-normal text-gray-500">
            Tell us a bit about your company, your team, and the types of
            projects you manage — so we can tailor your workspace to your
            operations.
          </p>
        </div>
        <CreateForm />
      </div>
    </div>
  );
}
