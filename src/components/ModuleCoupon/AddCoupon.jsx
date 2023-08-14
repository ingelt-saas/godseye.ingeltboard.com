import { Close } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, Modal, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import moduleCouponApi from "../../api/moduleCoupon";
import PropTypes from 'prop-types';

const AddCoupon = ({ open, close, coupons, refetch }) => {

    //states
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(null);

    // react-hook-form
    const { register, handleSubmit, watch, reset, setError, formState: { errors }, control } = useForm();

    // close function
    const handleClose = () => {
        if (loading) {
            return;
        }
        close();
    }

    // coupon create handler
    const createHandler = async (data) => {
        const coupon = data.couponCode;
        const isCouponHas = Array.isArray(coupons) && coupons.find(i => i.couponCode === coupon.toUpperCase());

        if (isCouponHas) {
            setError('couponCode', { type: 'custom', message: 'Coupon code is exists' });
            return;
        }

        setLoading(true);
        try {
            await moduleCouponApi.create(data);
            refetch();
            reset();
            handleClose();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        watch((value, { name }) => {
            if (name === 'startDate') {
                setStartDate(value.startDate);
            }
        });
    }, [watch]);

    return (
        <Modal open={open} onClose={handleClose} className='grid place-items-center py-5 overflow-y-auto'>
            <div className='outline-none bg-white rounded-md px-5 py-8 relative'>
                <IconButton onClick={handleClose} className='!absolute !top-4 !right-5'>
                    <Close />
                </IconButton>
                <h2 className='pb-2 text-xl font-semibold text-center border-b'>Add Coupon</h2>
                <form onSubmit={handleSubmit(createHandler)} className='min-w-[500px] mt-5 flex flex-col gap-y-4'>
                    <div>
                        <TextField
                            size='small'
                            label='Coupon Code'
                            fullWidth
                            InputLabelProps={{ className: "!text-sm" }}
                            inputProps={{ className: "!text-sm" }}
                            {...register('couponCode', { required: 'Coupon code is required' })}
                        />
                        {errors?.couponCode && <span className='text-xs text-red-500 font-medium mt-1'>{errors?.couponCode?.message}</span>}
                    </div>
                    <div>
                        <TextField
                            size='small'
                            label='Coupon Amount'
                            fullWidth
                            type="number"
                            InputLabelProps={{ className: "!text-sm" }}
                            inputProps={{ className: "!text-sm" }}
                            {...register('amount', { required: 'Coupon amount is required' })}
                        />
                        {errors?.amount && <span className='text-xs text-red-500 font-medium mt-1'>{errors?.amount?.message}</span>}
                    </div>
                    <div>
                        <TextField
                            multiline
                            rows={2}
                            size='small'
                            label='Coupon Description'
                            fullWidth
                            InputLabelProps={{ className: "!text-sm" }}
                            inputProps={{ className: "!text-sm", }}
                            {...register('desc', { required: false })}
                        />
                    </div>
                    <div>
                        <span className="!text-sm leading-none">Coupon Start Date</span>
                        <Controller
                            control={control}
                            name='startDate'
                            rules={{ required: false }}
                            render={({ field: { value, onChange } }) => <ReactDatePicker
                                className='focus:outline-none text-left px-4 cursor-pointer whitespace-nowrap border !w-full py-2 text-sm rounded-md'
                                selected={value}
                                onChange={onChange}
                                wrapperClassName='w-full'
                                placeholderText={'Click to set start date'}
                                minDate={new Date()}
                            />}
                        />
                    </div>
                    <div>
                        <span className="!text-sm leading-none">Coupon End Date</span>
                        <Controller
                            control={control}
                            name='endDate'
                            rules={{ required: false }}
                            render={({ field: { value, onChange } }) => <ReactDatePicker
                                className='focus:outline-none text-left px-4 cursor-pointer whitespace-nowrap border !w-full py-2 text-sm rounded-md'
                                selected={value}
                                onChange={onChange}
                                wrapperClassName='w-full'
                                placeholderText={'Click to set end date'}
                                minDate={startDate ? startDate : new Date()}
                                disabled={Boolean(!startDate)}
                            />}
                        />
                    </div>

                    <div>
                        <Button
                            type='submit'
                            disabled={loading}
                            startIcon={loading && <CircularProgress color="inherit" size={16} />}
                            variant='contained'
                            className='!capitalize !font-medium !text-sm !py-3 !w-full'
                        >Add Coupon</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

AddCoupon.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    coupons: PropTypes.array,
    refetch: PropTypes.func
};

export default AddCoupon;
