import { MouseEvent, useEffect, useState } from "react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewCouponMutation } from "../../../redux/api/paymentAPI";
import { responseToast } from "../../../utils/features";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const allNumbers = "1234567890";
const allSymbols = "!@#$%^&*()_+";

const Coupon = () => {
    const [size, setSize] = useState<number>(8);
    const [prefix, setPrefix] = useState<string>("");
    const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
    const [includeCharacters, setIncludeCharacters] = useState<boolean>(false);
    const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const [coupon, setCoupon] = useState<string>("");

    const { user } = useSelector((state: RootState) => state.userReducer);
    const [newCoupon] = useNewCouponMutation();

    const copyText = async (coupon: string) => {
        await window.navigator.clipboard.writeText(coupon);
        setIsCopied(true);
    };

    const submitHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!includeNumbers && !includeCharacters && !includeSymbols)
            return alert("Please Select One At Least");

        let result: string = prefix || "";
        const loopLength: number = size - result.length;

        for (let i = 0; i < loopLength; i++) {
            let entireString: string = "";
            if (includeCharacters) entireString += allLetters;
            if (includeNumbers) entireString += allNumbers;
            if (includeSymbols) entireString += allSymbols;

            const randomNum: number = ~~(Math.random() * entireString.length);
            result += entireString[randomNum];
        }

        setCoupon(result);
    };

    const handleSaveClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const formData = {
            coupon,
            amount: +(Math.random() * 100000).toFixed(2),
        };

        const res = await newCoupon({ formData, userId: user?._id! });
        responseToast(res, null, "");
    };

    useEffect(() => {
        setIsCopied(false);
    }, [coupon]);

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="dashboard-app-container">
                <h1>Coupon</h1>
                <section>
                    <form className="coupon-form">
                        <input
                            type="text"
                            placeholder="Text to include"
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
                            maxLength={size}
                        />

                        <input
                            type="number"
                            placeholder="Coupon Length"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            min={8}
                            max={25}
                        />

                        <fieldset>
                            <legend>Include</legend>

                            <input
                                type="checkbox"
                                checked={includeNumbers}
                                onChange={() => setIncludeNumbers((prev) => !prev)}
                            />
                            <span>Numbers</span>

                            <input
                                type="checkbox"
                                checked={includeCharacters}
                                onChange={() => setIncludeCharacters((prev) => !prev)}
                            />
                            <span>Characters</span>

                            <input
                                type="checkbox"
                                checked={includeSymbols}
                                onChange={() => setIncludeSymbols((prev) => !prev)}
                            />
                            <span>Symbols</span>
                        </fieldset>

                        <div className="btn-container">
                            <button onClick={submitHandler}>Generate</button>
                            {coupon && <button onClick={handleSaveClick}>Save</button>}
                        </div>
                    </form>

                    {coupon && (
                        <code style={{ padding: "4px 8px" }}>
                            {coupon}
                            <span onClick={() => copyText(coupon)}>
                                {isCopied ? "Copied" : "Copy"}
                            </span>
                        </code>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Coupon;
