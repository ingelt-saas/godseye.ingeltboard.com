import { useQuery } from '@tanstack/react-query';
import { Button, CircularProgress, IconButton, Popover } from '@mui/material';
import moment from 'moment';
import { Close, Delete, Edit } from '@mui/icons-material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import DeleteConfirmModal from '../components/shared/DeleteConfirmModal';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import couponApi from '../api/coupon';
import AddCoupon from '../components/ModuleCoupon/AddCoupon';
import PropTypes from 'prop-types';

const DescPopup = ({ desc, updateHandler }) => {

    const [description, setDescription] = useState(desc || '');

    return <PopupState variant='popover' popupId="demo-popup-popover">
        {(popupState) => <>
            <IconButton size="small" {...bindTrigger(popupState)} className='opacity-0 group-hover:opacity-100 duration-500 !absolute !top-0 !right-0 translate-y-1/2'>
                <Edit fontSize='small' />
            </IconButton>
            <Popover
                PaperProps={{ className: '!rounded-2xl shadow-2xl bg-white' }}
                {...bindPopover(popupState)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                <div className='p-4 z-50 bg-white w-[300px] relative'>
                    <IconButton className='!absolute !top-2 !right-2' onClick={popupState.close}>
                        <Close />
                    </IconButton>
                    <h4 className='text-base font-semibold'>{desc ? 'Update Description' : 'Set Description'}</h4>
                    <textarea
                        className='resize-none border-2 rounded-lg focus:outline-none px-1 my-2 w-full py-1 text-sm min-h-[100px]'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <Button
                        onClick={() => updateHandler(description,
                            () => popupState.close()
                        )}
                        disabled={Boolean(!description) || (description && description === desc)}
                        variant='contained'
                        className='!capitalize'
                        sx={{
                            fontWeight: 500,
                            padding: '0.3rem 2rem',
                        }}
                    >{desc ? 'Update' : 'Set'}</Button>
                </div>
            </Popover>
        </>}
    </PopupState>
}

const AmountPopup = ({ amount, updateHandler }) => {

    const [couponAmount, setCouponAmount] = useState(amount);

    return <PopupState variant='popover' popupId="demo-popup-popover">
        {(popupState) => <>
            <IconButton size="small" {...bindTrigger(popupState)} className='opacity-0 group-hover:opacity-100 duration-500 !absolute !top-0 !right-0 translate-y-1/2'>
                <Edit fontSize='small' />
            </IconButton>
            <Popover
                PaperProps={{ className: '!rounded-2xl shadow-2xl bg-white' }}
                {...bindPopover(popupState)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                <div className='p-4 z-50 bg-white w-[300px] relative'>
                    <IconButton className='!absolute !top-2 !right-2' onClick={popupState.close}>
                        <Close />
                    </IconButton>
                    <h4 className='text-base font-semibold'>{amount ? 'Update Amount' : 'Set Amount'}</h4>
                    <input
                        className='resize-none border-2 rounded-md focus:outline-none px-3 my-2 w-full py-2 text-sm'
                        type='number'
                        value={couponAmount}
                        onChange={(e) => setCouponAmount(e.target.value)}
                    />
                    <Button
                        onClick={() => updateHandler(couponAmount, () => popupState.close())}
                        disabled={Boolean(!couponAmount) || (couponAmount && couponAmount === amount)}
                        variant='contained'
                        className='!capitalize'
                        sx={{
                            fontWeight: 500,
                            padding: '0.3rem 2rem',
                        }}
                    >{amount ? 'Update' : 'Set'}</Button>
                </div>
            </Popover>
        </>}
    </PopupState>
}

const CouponDate = ({ couponDate, updateHandler, placeholderText }) => {

    const [date, setDate] = useState(couponDate ? new Date(couponDate) : null);

    const isDateMatch = moment(couponDate).isSame(date);

    return <DatePicker
        className='focus:outline-none text-center whitespace-nowrap'
        selected={date}
        onChange={(dt) => setDate(dt)}
        onCalendarClose={() => !isDateMatch && updateHandler(date)}
        placeholderText={placeholderText}
        minDate={new Date()}
        dateFormat="MMM d, yyyy"
    />
}


const ModuleCoupon = () => {

    // states
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // fetch module coupon
    const { data: moduleCoupons, isLoading, refetch } = useQuery({
        queryKey: ['moduleCoupons'],
        queryFn: async () => {
            const res = await couponApi.getAll();
            return res.data;
        }
    });

    // delete coupon
    const deleteCoupon = async (e) => {
        if (!deleteConfirm) {
            return;
        }

        e.target.disabled = true;
        try {
            await couponApi.delete(deleteConfirm?.id);
            toast.success('Module coupon deleted');
            setDeleteConfirm(null);
            refetch();
        } catch (err) {
            console.error(err);
        } finally {
            e.target.disabled = false;
        }
    }

    // update coupon
    const updateCoupon = async (couponId, updateData, successMessage, closePopup = null,) => {
        try {
            await couponApi.update(couponId, updateData);
            typeof closePopup === 'function' && closePopup();
            toast.success(successMessage);
            refetch();
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div className="px-5">
            <div className='flex justify-between items-center border-b py-2 px-5'>
                <h1 className="text-3xl font-medium">Module Coupon</h1>
                <Button
                    onClick={() => setIsOpen(true)}
                    variant='contained'
                    className='!capitalize !font-medium !text-sm !py-3'
                >Add Coupon</Button>
            </div>
            <div className='mt-10'>
                {isLoading && <div className='flex justify-center py-5'>
                    <CircularProgress />
                </div>}

                {!isLoading && (Array.isArray(moduleCoupons) && moduleCoupons.length > 0 ?
                    <table className='w-full text-xs bg-white'>
                        <thead className='bg-white !rounded-t-lg overflow-hidden'>
                            <tr>
                                <th className='px-2 py-3 text-center border-b'>Serial</th>
                                <th className='px-2 py-3 text-center border-b'>Coupon Code</th>
                                <th className='px-2 py-3 text-center border-b'>Coupon Amount</th>
                                <th className='px-2 py-3 text-center border-b'>Description</th>
                                <th className='px-2 py-3 text-center border-b'>Start Date</th>
                                <th className='px-2 py-3 text-center border-b'>End Date</th>
                                <th className='px-2 py-3 text-center border-b'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {moduleCoupons.map((item, index) => <tr key={item.id}>
                                <td className='px-2 py-3 border-b whitespace-nowrap text-center'>
                                    {index + 1}
                                </td>
                                <td className='px-2 py-3 text-center border-b whitespace-nowrap'>{item?.couponCode}</td>
                                <td className='px-2 py-3 text-center border-b whitespace-pre-wrap relative group pl-5'>
                                    {item?.amount}
                                    <AmountPopup amount={item.amount} updateHandler={(amount, close) => updateCoupon(item.id, { amount }, ' Coupon amount has been updated', close)} />
                                </td>
                                <td className='px-2 py-3 text-center border-b whitespace-pre-wrap relative group pl-5'>
                                    {item?.desc ? item?.desc.split('').slice(0, 40).join('') + '..' : 'Not Set'}
                                    <DescPopup desc={item.desc} updateHandler={(desc, close) => updateCoupon(item.id, { desc }, 'Coupon description updated', close)} />
                                </td>
                                <td className='px-2 py-3 text-center border-b'>
                                    <CouponDate
                                        couponDate={item.startDate}
                                        placeholderText={'Click to set start date'}
                                        updateHandler={(date) => updateCoupon(item.id, { startDate: date }, 'Coupon start date updated')}
                                    />
                                </td>
                                <td className='px-2 py-3 text-center border-b'>
                                    <CouponDate
                                        couponDate={item.endDate}
                                        placeholderText={'Click to set end date'}
                                        updateHandler={(date) => updateCoupon(item.id, { endDate: date }, 'Coupon end date updated')}
                                    />
                                </td>
                                <td className='px-2 py-3 text-center border-b'>
                                    <IconButton onClick={() => setDeleteConfirm({ name: item.couponCode, id: item?.id })}>
                                        <Delete fontSize='small' />
                                    </IconButton>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                    :
                    <p className='text-center mx-auto text-red-500 font-medium'>No Coupon Found</p>
                )}
            </div>

            {/* delete confirm modal */}
            <DeleteConfirmModal
                close={() => setDeleteConfirm(null)}
                open={Boolean(deleteConfirm)}
                data={deleteConfirm}
                confirmHandler={deleteCoupon}
                name={'module coupon code'}
            />

            {/* coupon add modal */}
            <AddCoupon open={isOpen} close={() => setIsOpen(false)} refetch={refetch} coupons={moduleCoupons} />

        </div >
    );
}

AmountPopup.propTypes = {
    amount: PropTypes.number,
    updateHandler: PropTypes.func,
};

DescPopup.propTypes = {
    desc: PropTypes.string,
    updateHandler: PropTypes.func,
};

CouponDate.propTypes = {
    couponDate: PropTypes.string,
    updateHandler: PropTypes.func,
    placeholderText: PropTypes.string
};

export default ModuleCoupon;
