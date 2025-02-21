import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";

export const StoreShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          ID
        </Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">
          Name
        </Typography>
        <TextField value={record?.name} />

        <Typography variant="body1" fontWeight="bold">
          Image URL
        </Typography>
        {record?.image_url ? (
          <img
            src={record.image_url}
            alt="Store"
            style={{ maxWidth: "300px", width: "100%", height: "auto" }}
          />
        ) : (
          <Typography>No image available</Typography>
        )}
      </Stack>
    </Show>
  );
};
