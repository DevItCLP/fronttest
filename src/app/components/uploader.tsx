import { Uploader, Button, Loader } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { PhotoCamera } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

/*EJEMPLO DE USO   
<UploaderCC _control={control} label=" Adjuntar fotografias" icon={<Image />} name="imagenes" placeholder=" Adjunte una foto" required={true} multiple={true} errors={errors} shouldFocus={false} />;
 */

export const UploaderCC = ({
  _control,
  label,
  name,
  required,
  multiple,
  errors,
  shouldFocus,
  disabled,
}: {
  _control: any;
  label: string;
  name: string;
  required: boolean;
  multiple: boolean;
  errors: any;
  shouldFocus: boolean;
  disabled?: boolean;
}) => {
  const selectRef = useRef<any>(null);

  useEffect(() => {
    if (shouldFocus && selectRef.current) {
      selectRef.current.open(); // Simula el enfoque llamando al método open()
    }
  }, [shouldFocus]);

  return (
    <div>
      <Controller
        name={name}
        control={_control}
        rules={{
          required: { value: required, message: `${label} is required` },
        }}
        render={({ field }) => (
          <Uploader
            disabled={disabled}
            {...field}
            accept=".png, .jpg, .jpeg, .pdf"
            multiple={multiple}
            action=""
            autoUpload={false}
            listType="picture-text"
            ref={selectRef}
            renderFileInfo={(file: any) => {
              const truncatedName = file.name.length > 20 ? file.name.substring(0, 17) + "..." : file.name;
              return (
                <div
                  style={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {truncatedName}
                </div>
              );
            }}
          >
            <Box border={1} borderColor="#D6DBDF" borderRadius={1} p={1} mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1" style={{ color: "#ABB2B9" }}>
                  {label}
                </Typography>
                <Box className="text-end">
                  <Button>
                    <PhotoCamera />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Uploader>
        )}
      />
      {errors[name] && typeof errors[name].message === "string" && <Typography color="error">{errors[name].message}</Typography>}
    </div>
  );
};

export const UploaderMinCC = ({
  _control,
  label,
  name,
  required,
  multiple,
  errors,
  shouldFocus,
}: {
  _control: any;
  label: string;
  name: string;
  required: boolean;
  multiple: boolean;
  errors: any;
  shouldFocus: boolean;
}) => {
  const selectRef = useRef<any>(null);

  useEffect(() => {
    if (shouldFocus && selectRef.current) {
      selectRef.current.open(); // Simula el enfoque llamando al método open()
    }
  }, [shouldFocus]);

  return (
    <div style={{ maxWidth: "50%" }}>
      <Controller
        name={name}
        control={_control}
        rules={{
          required: { value: required, message: `${label} is required` },
        }}
        render={({ field }) => (
          <Uploader
            {...field}
            accept=".png, .jpg, .jpeg"
            multiple={multiple}
            listType="picture-text"
            action=""
            autoUpload={false}
            ref={selectRef}
            renderFileInfo={(file: any) => {
              const truncatedName = file.name.length > 20 ? file.name.substring(0, 17) + "..." : file.name;
              return (
                <div
                  style={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {truncatedName}
                </div>
              );
            }}
          >
            <Button style={{ fontSize: "26px" }}>
              <PhotoCamera />
            </Button>
          </Uploader>
        )}
      />
      {errors[name] && typeof errors[name].message === "string" && <Typography color="error">{errors[name].message}</Typography>}
    </div>
  );
};
export const UploaderAvatar = ({
  _control,
  name,
  icon,
  required,
  label,
  multiple,
  errors,
  shouldFocus,
  onUploadCallback,
  imagePreview,
  disabled,
}: {
  _control: any;
  name: string;
  icon: any;
  required: boolean;
  label?: string;
  multiple: boolean;
  errors: any;
  shouldFocus: boolean;
  onUploadCallback?: (file: any) => void;
  imagePreview?: string;
  disabled?: boolean;
}) => {
  const selectRef = useRef<any>(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (shouldFocus && selectRef.current) {
      selectRef.current.open(); // Simula el enfoque llamando al método open()
    }
  }, [shouldFocus]);

  return (
    <div>
      <Controller
        name={name}
        control={_control}
        rules={{
          required: { value: required, message: `${label} is required` },
        }}
        render={({ field }) => (
          <Uploader
            disabled={disabled}
            fileListVisible={false}
            {...field}
            accept=".png, .jpg, .jpeg"
            multiple={multiple}
            listType="picture-text"
            action=""
            onUpload={(file) => {
              setUploading(true);
              previewFile(file.blobFile, (value: any) => {
                setFileInfo(value);
                if (onUploadCallback) {
                  onUploadCallback(file);
                }
              });
            }}
            onSuccess={(response, file) => {
              setUploading(false);
            }}
            onError={() => {
              setFileInfo(null);
              setUploading(false);
            }}
            //autoUpload={false}
            ref={selectRef}
          >
            <Button style={{ fontSize: "26px" }}>
              {uploading && <Loader backdrop center />}
              {fileInfo ? (
                <img src={fileInfo} width="100%" height="100%" />
              ) : imagePreview != "" ? (
                <img src={imagePreview} width="100%" height="100%" />
              ) : (
                icon
              )}
            </Button>
          </Uploader>
        )}
      />
      {errors[name] && typeof errors[name].message === "string" && <Typography color="error">{errors[name].message}</Typography>}
    </div>
  );
};
function previewFile(file: any, callback: any) {
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}
