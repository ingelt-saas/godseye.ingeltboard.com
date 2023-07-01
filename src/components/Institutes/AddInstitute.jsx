import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import instituteApi from "../../api/institute";
import { toast } from "react-toastify";
import { useRef } from "react";
import Compressor from "compressorjs";
import { Remove } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import uploadToAWS from "../../aws/upload";
import Image from '../shared/Image';

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

const InputField = ({ label, name, type, validation, options, Form }) => {

    const { register, formState: { errors } } = Form;

    return (
        <div>
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
                        {...register(name, validation)}
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
                    {...register(name, validation)}
                />
            )}
            {errors[name] && <span className="text-xs text-red-500 mt-1 font-medium">{errors[name].message}</span>}
        </div>
    );
};

const AddInstitute = () => {

    const [selectedImages, setSelectedImages] = useState([]);
    const imageFieldInput = useRef(null);
    const [defaultValues, setDefaultValues] = useState({});
    const [selectedState, setSelectedState] = useState(null);
    const [institute, setInstitute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [search] = useSearchParams();
    const instituteId = search.get('id');

    // react-hook-form 
    const Form = useForm({ defaultValues: defaultValues });
    const { handleSubmit, control, formState: { errors }, reset, setValue } = Form;

    // upload to s3
    const orgImagesUpload = async () => {
        let arr = [];
        for (let image of selectedImages) {
            if (typeof image === 'object') {
                const res = await uploadToAWS(image, 'institute');
                arr.push(res);
            } else {
                arr.push({ Key: image });
            }
        }
        return arr;
    }

    // institute add handler
    const addInstitute = async (data) => {

        setLoading(true);
        setError('');
        const images = await orgImagesUpload();

        data.images = images.map(i => i.Key);
        setSelectedImages(data.images);

        try {
            await instituteApi.create(data);
            toast.success("Institute created.");
            reset();
            setSelectedImages([]);
        } catch (err) {
            if (err.response.status === 409) {
                setError(err.response.data?.message);
            } else {
                toast.error("Sorry! Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    // institute update handler
    const updateInstitute = async (data) => {

        setError('');
        setLoading(true);
        const images = await orgImagesUpload();

        data.images = images.map(i => i.Key);
        setSelectedImages(data.images);

        for (let key in data) {
            if (data[key] === institute[key]) {
                delete data[key];
            }
        }

        if (data.partnerEmail === institute.admin.email) {
            delete data.partnerEmail;
        }

        try {
            await instituteApi.update(instituteId, data);
            toast.success(`${institute.name} updated`);
        } catch (err) {
            if (err.response.status === 409) {
                setError(err.response.data?.message);
            } else {
                toast.error("Sorry! Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    // input fields
    const inputFieldArr = [
        {
            label: "Partner's Name",
            name: "partnerName",
            type: "text",
            validation: {
                required: 'Partner name is required',
            }
        },
        {
            label: "Partner's Phone",
            name: "partnerPhoneNo",
            type: "tel",
            validation: {
                required: 'Partner phone number is required',
                pattern: {
                    value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                    message: "Invalid phone number",
                },
            },
        },
        {
            label: "Partner's Email",
            name: "partnerEmail",
            type: "email",
            validation: {
                required: 'Partner email is required',
                pattern: {
                    value: /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/,
                    message: "Invalid email address",
                },
            },
        },
        {
            label: "Institute's Name",
            name: "name",
            type: "text",
            validation: {
                required: 'Institute name is required',
            }
        },
        {
            label: "Institute's Phone",
            name: "phoneNo",
            type: "tel",
            validation: {
                required: 'Institute phone number is required',
                pattern: {
                    value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                    message: "Invalid phone number",
                },
            },
        },
        {
            label: "Institute's Email",
            name: "email",
            type: "email",
            validation: {
                required: 'Institute email is required',
                pattern: {
                    value: /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/,
                    message: "Invalid email address",
                },
            },
        },
        {
            label: "Website",
            name: "website",
            type: "text",
            validation: {
                required: false,
                pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Please provide valid url",
                },
            },
        },
        {
            label: "Address",
            name: "address",
            type: "text",
            validation: {
                required: false,
            }
        },
        {
            label: "Rating",
            name: "overallRating",
            type: "text",
            validation: {
                required: false,
                pattern: {
                    value: /^(?:9(?:\.[0]*)?|[0-8](?:\.\d+)?)$/,
                    message: 'Invalid score, score should be like 2.4 or 5',
                }
            }
        },
        {
            label: "Demo video URL",
            name: "DemoVideoURL",
            type: "text",
            validation: {
                required: false,
                pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Please provide valid url",
                },
            },
        },
        {
            label: "Embed URL",
            name: "embedUrl",
            type: "text",
            validation: {
                required: false,
                pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Please provide valid url",
                },
            },
        },
        {
            label: "Prize",
            name: "fee",
            type: "number",
            validation: {
                required: 'Prize is required',
            }
        },
        {
            label: "Discounted Price",
            name: "discountedFee",
            type: "number",
            validation: {
                required: false,
            }
        },
    ];

    // image compression
    const imageCompress = (file) => new Promise((resolve) => {
        new Compressor(file, {
            quality: 0.6,
            convertTypes: 'image/webp',
            success: (result) => resolve(result)
        });
    });

    // image handler 
    const imagesHandler = async (e) => {

        const compressedImages = [...selectedImages];

        const files = e.target.files;
        for (let file of files) {
            if (['image/png', 'image/jpeg', 'image/webp'].includes(file.type) && compressedImages.length < 5) {
                const compressImage = await imageCompress(file);
                compressedImages.push(compressImage);
            }
        }
        setSelectedImages(compressedImages);
    }

    // selected image remove handler
    const removeImageFromSelectedImages = (index) => {
        if (loading) {
            return;
        }
        let images = [...selectedImages];
        images.splice(index, 1);
        setSelectedImages(images);
    }

    // fetch institute and institute admin
    useEffect(() => {
        if (instituteId) {
            (async () => {
                try {
                    const res = await instituteApi.readById(instituteId);
                    const getInstitute = res.data;
                    if (getInstitute) {
                        for (let key in getInstitute) {
                            setValue(key, getInstitute[key]);
                            if (key === 'admin') {
                                setValue('partnerName', getInstitute[key].name);
                                setValue('partnerEmail', getInstitute[key].email);
                                setValue('partnerPhoneNo', getInstitute[key].phoneNo);
                            }
                        }
                        if (getInstitute.state) {
                            setSelectedState(getInstitute.state);
                        }
                    }
                    setInstitute(getInstitute);
                    let orgImages = getInstitute.orgImages;
                    orgImages = orgImages.map(i => i.name);
                    setSelectedImages(orgImages);
                } catch (err) {
                    console.error(err);
                }
            })();
        }
    }, [instituteId]);


    return (
        <div className="">
            <form
                className="flex flex-col bg-white my-28 mx-36 p-10 rounded-md shadow-xl"
                onSubmit={handleSubmit(institute ? updateInstitute : addInstitute)}
            >
                <h1 className="text-xl text-center font-semibold mb-4 uppercase">
                    {institute ? `Update ${institute?.name}` : 'Fill The Details To List the Institute'}
                </h1>
                <div className="w-full">
                    {inputFieldArr.map((item, index) => (
                        <InputField
                            key={index}
                            {...item}
                            Form={Form}
                        />
                    ))}

                    <div>
                        <Controller
                            name="modeOfClasses"
                            rules={{ required: 'Mode of institute is required' }}
                            control={control}
                            render={({ field: { value, onChange, name } }) => <FormControl variant="standard" sx={{ width: "100%", mt: 1 }}>
                                <InputLabel id="demo-simple-select-standard-label">
                                    Mode of Institute
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    label="Mode of Institute"
                                    className="!capitalize"
                                    sx={InputFieldStyle}
                                    onChange={onChange}
                                    value={value || ''}
                                    name={name} // Add the 'name' attribute
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="online">Online</MenuItem>
                                    <MenuItem value="offline">Offline</MenuItem>
                                    <MenuItem value="hybrid">Hybrid</MenuItem>

                                </Select>
                            </FormControl>}
                        />
                        {errors?.modeOfClasses && <span className="text-xs text-red-500 mt-1 font-medium">{errors.modeOfClasses.message}</span>}
                    </div>

                    <div>
                        <Controller
                            name="state"
                            rules={{ required: 'State is required' }}
                            control={control}
                            render={({ field: { value, onChange, name } }) => <FormControl variant="standard" sx={{ width: "100%", mt: 1 }}>
                                <InputLabel id="demo-simple-select-standard-label">
                                    State
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    label="State"
                                    className="!capitalize"
                                    sx={InputFieldStyle}
                                    onChange={(e) => {
                                        setSelectedState(e.target.value);
                                        onChange(e);
                                    }}
                                    value={value || ''}
                                    name={name} // Add the 'name' attribute
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
                            </FormControl>}
                        />
                        {errors?.state && <span className="text-xs text-red-500 mt-1 font-medium">{errors.state.message}</span>}
                    </div>

                    <div>
                        <Controller
                            name="zone"
                            rules={{ required: 'Zone is required' }}
                            control={control}
                            render={({ field: { value, onChange, name } }) => <FormControl variant="standard" sx={{ width: "100%", mt: 1 }}>
                                <InputLabel id="demo-simple-select-standard-label">Zone</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    label="Zone"
                                    className="!capitalize"
                                    sx={InputFieldStyle}
                                    name={name}
                                    value={value || ''}
                                    onChange={onChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {selectedState === "Delhi" &&
                                        cityOptions["Delhi"].map((item) => (
                                            <MenuItem key={item} value={item} className="!capitalize">
                                                {item}
                                            </MenuItem>
                                        ))}
                                    {selectedState === "Punjab" &&
                                        Array.isArray(Object.keys(cityOptions)) &&
                                        cityOptions["Punjab"].map((item) => (
                                            <MenuItem key={item} value={item} className="!capitalize">
                                                {item}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>}
                        />
                        {errors?.zone && <span className="text-xs text-red-500 mt-1 font-medium">{errors.zone.message}</span>}
                    </div>

                    <div className="mt-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                            {selectedImages.map((item, index) => <div className="w-40 h-40 border-2 overflow-hidden cursor-pointer relative rounded-lg" key={index}>
                                <button
                                    type="button"
                                    onClick={() => removeImageFromSelectedImages(index)}
                                    className="absolute text-white grid place-items-center w-6 h-6 rounded-full top-1 right-1 bg-[#0C3C82] bg-opacity-70 duration-200 hover:bg-opacity-100"
                                >
                                    <Remove />
                                </button>
                                {typeof item === 'object' && <img src={URL.createObjectURL(item)} className="w-full h-full object-cover" />}
                                {typeof item !== 'object' && <Image src={item} className={"w-full h-full object-cover"} />}
                            </div>)}
                        </div>
                        <input onChange={imagesHandler} ref={imageFieldInput} type="file" multiple className="sr-only hidden" accept=".png, .webp, .jepg, .jpg" />
                        <Button
                            disabled={Boolean(selectedImages.length >= 5)}
                            variant="contained"
                            onClick={() => {
                                imageFieldInput.current.click();
                            }}
                            type="button"
                            sx={{
                                backgroundColor: '#0C3C82',
                                color: 'white',
                                textTransform: 'capitalize',
                                fontWeight: 500,
                                padding: '0.4rem 2rem',
                                '&:hover': {
                                    backgroundColor: '#0C3C82',
                                }
                            }}
                        >
                            Add Images
                        </Button>
                    </div>
                    {loading && <div className="mt-4 flex justify-center">
                        <CircularProgress sx={{ '& circle': { stroke: '#0C3C82' } }} />
                    </div>}
                    {error && <p className="text-center text-red-500 font-medium text-sm mt-3">{error}</p>}
                </div>

                <Button
                    sx={{
                        marginTop: "2rem",
                        // backgroundColor: '#0C3C82',
                        color: '#0C3C82',
                        textTransform: 'capitalize',
                        fontWeight: 500,
                        padding: '0.4rem 2rem',
                        border: '2px solid #0C3C82',
                        '&:hover': {
                            backgroundColor: '#0C3C82',
                            color: 'white',
                            border: '2px solid #0C3C82',
                        }
                    }}
                    type="submit"
                    variant="outlined"
                    disabled={loading}
                >
                    {institute ? 'Update Institute' : 'Submit Institute'}
                </Button>
            </form>
        </div>
    );
}

export default AddInstitute;
