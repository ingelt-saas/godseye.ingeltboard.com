import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import instituteApi from "../../api/institute";
import { toast } from "react-toastify";

const InputFieldStyle = {
    paddingTop: "10px",
    marginTop: "10px",
    width: "100%",
};

const cityOptions = {
    Delhi: [
        "North West Delhi",
        "North Delhi",
        "North East Delhi",
        "Central Delhi",
        "New Delhi",
        "East Delhi",
        "South Delhi",
        "South East Delhi",
        "South West Delhi",
        "West Delhi",
    ],
    Punjab: [
        "Amritsar",
        "Barnala",
        "Bathinda",
        "Faridkot",
        "Fatehgarh Sahib",
        "Fazilka",
        "Firozpur",
        "Gurdaspur",
        "Hoshiarpur",
        "Jalandhar",
        "Kapurthala",
        "Ludhiana",
        "Mansa",
        "Moga",
        "Muktsar",
        "Nawanshahr",
        "Pathankot",
        "Patiala",
        "Rupnagar",
        "Sahibzada Ajit Singh Nagar",
        "Sangrur",
        "Tarn Taran",
    ],
};

const InputField = ({ label, name, type, options, handleChange }) => {
    return (
        <>
            {type === "select" && (
                <FormControl variant="standard" sx={{ width: "100%", mt: 1 }}>
                    <InputLabel id="demo-simple-select-standard-label">
                        {label}
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label={label}
                        defaultValue=""
                        className="!capitalize"
                        sx={InputFieldStyle}
                        onChange={handleChange}
                        name={name} // Add the 'name' attribute
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {Array.isArray(options) &&
                            options.map((item) => (
                                <MenuItem key={item} value={item} className="!capitalize">
                                    {item}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            )}

            {type !== "select" && type !== "rating" && type !== "file" && (
                <TextField
                    id="standard-basic"
                    label={label}
                    variant="standard"
                    type={type}
                    sx={InputFieldStyle}
                    onChange={handleChange}
                    name={name} // Add the 'name' attribute
                />
            )}
        </>
    );
};

const AddInstitute = () => {

    const [formData, setFormData] = useState({
        PartnerImages: "",
        Partnername: "",
        PartnerPhoneNo: "",
        PartnerEmail: "",
        InstituteName: "",
        InstitutePhone: "",
        InstituteEmail: "",
        website: "",
        overallRating: 0,
        DemoVideoURL: "",
        prize: 0,
        discountedPrice: 0,
        State: "",
        Zone: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await instituteApi.create(formData);
            toast.success("Submitted.");
            resetForm();
            window.location.reload();
            // reset();
        } catch (err) {
            toast.error("Sorry! Something went wrong.");
        }
    };

    const resetForm = () => {
        setFormData({
            PartnerImages: "",
            Partnername: "",
            PartnerPhoneNo: "",
            PartnerEmail: "",
            InstituteName: "",
            InstitutePhoneNo: null,
            InstituteEmail: "",
            website: "",
            overallRating: null,
            DemoVideoURL: "",
            prize: null,
            discountedPrice: null,
            State: "",
            Zone: "",
        });
    };

    const inputFieldArr = [
        {
            label: "Partner's Images",
            name: "PartnerImages",
            type: "file",
        },
        {
            label: "Partner's Name",
            name: "Partnername",
            type: "text",
        },
        {
            label: "Partner's Phone",
            name: "PartnerPhoneNo",
            type: "tel",
            validation: {
                pattern: {
                    value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                    message: "Please provide valid phone number",
                },
            },
        },
        {
            label: "Partner's Email",
            name: "PartnerEmail",
            type: "email",
            validation: {
                pattern: {
                    value: /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/,
                    message: "Please provide valid email address",
                },
            },
        },
        {
            label: "Institute's Name",
            name: "InstituteName",
            type: "text",
        },
        {
            label: "Institute's Phone",
            name: "InstitutePhone",
            type: "tel",
            validation: {
                pattern: {
                    value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                    message: "Please provide valid phone number",
                },
            },
        },
        {
            label: "Institute's Email",
            name: "InstituteEmail",
            type: "email",
            validation: {
                pattern: {
                    value: /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/,
                    message: "Please provide valid email address",
                },
            },
        },
        {
            label: "Website",
            name: "website",
            type: "text",
            validation: {
                pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Please provide valid url",
                },
            },
        },
        {
            label: "Rating",
            name: "overallRating",
            type: "float",
        },
        {
            label: "Demo video URL",
            name: "DemoVideoURL",
            type: "text",
            validation: {
                pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Please provide valid url",
                },
            },
        },
        {
            label: "Prize",
            name: "prize",
            type: "number",
        },
        {
            label: "Discounted Price",
            name: "discountedPrice",
            type: "number",
        },
    ];

    return (
        <div className="">
            <form
                className="flex flex-col bg-white my-28 mx-36 p-10 rounded-md shadow-xl"
                onSubmit={handleSubmit}
            >
                <h1 className="text-xl text-center font-semibold mb-4 uppercase">
                    Fill The Details To List the Institute
                </h1>
                <div className="w-full">
                    {inputFieldArr.map((item, index) => (
                        <InputField
                            key={index}
                            {...item}
                            handleChange={handleChange} // Pass the handleChange function as prop
                        />
                    ))}

                    <FormControl variant="standard" sx={{ width: "100%", mt: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                            State
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            label="State"
                            // defaultValue=""
                            className="!capitalize"
                            sx={InputFieldStyle}
                            onChange={handleChange}
                            name="State" // Add the 'name' attribute
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {Array.isArray(Object.keys(cityOptions)) &&
                                Object.keys(cityOptions).map((item) => (
                                    <MenuItem key={item} value={item} className="!capitalize">
                                        {item}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ width: "100%", mt: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">Zone</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            label="Zone"
                            className="!capitalize"
                            sx={InputFieldStyle}
                            onChange={handleChange}
                            name="Zone" // Add the 'name' attribute
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {formData.State === "Delhi" &&
                                cityOptions["Delhi"].map((item) => (
                                    <MenuItem key={item} value={item} className="!capitalize">
                                        {item}
                                    </MenuItem>
                                ))}
                            {formData.State === "Punjab" &&
                                Array.isArray(Object.keys(cityOptions)) &&
                                cityOptions["Punjab"].map((item) => (
                                    <MenuItem key={item} value={item} className="!capitalize">
                                        {item}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </div>

                <Button
                    sx={{
                        marginTop: "2vh",
                    }}
                    type="submit"
                    variant="outlined"
                >
                    Submit
                </Button>
            </form>
        </div>
    );
}

export default AddInstitute;
