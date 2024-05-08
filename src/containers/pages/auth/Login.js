import { Button, Card, Form, Input, message } from "antd";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import bgLogin from "../../../image/resto.png";
import imgLogo from "../../../image/logo.jpg";
import axios from "axios";
import { baseUrl } from "../../../config";
import { update } from "../../../features/authSlice";
import jwt_decode from "jwt-decode";
import { getOneUserMenu } from "../../../features/users/usermenuSlice";
import Cookies from "universal-cookie";
import imgDriving from "../../../image/driving3.jpg";

const Login = () => {
	const cookies = new Cookies();
	const formRef = useRef(null);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [isSave, setIsSave] = useState(false);

	// const refreshToken = async () => {
	//     await axios
	//         .get(baseUrl + "/token", {
	//             withCredentials: true,
	//         })
	//         .then((res) => {
	//             // console.log(res.data);
	//             const decoded = jwt_decode(res.data.accessToken);
	//             // console.log(decoded);
	//             dispatch(
	//                 update({
	//                     userid: decoded.userid,
	//                     username: decoded.first_name + " " + decoded.last_name,
	//                     role: decoded.role,
	//                     token: res.data.accessToken,
	//                 })
	//             );

	//             ///ambil data usermenu
	//             dispatch(getOneUserMenu(decoded.userid));
	//             navigate("/");
	//         })
	//         .catch((err) => {
	//             if (err.response) {
	//                 navigate("/login");
	//             }
	//         });

	// };

	const onFinish = async (v) => {
		// console.log(v);
		setIsSave(true);
		const data = {
			email: v.email,
			password: v.password,
		};

		await axios
			.post(baseUrl + "/users/login-email", data, {
				withCredentials: true,
			})
			.then((res) => {
				// refreshToken();
				const accToken = res.data.accessToken;
				const decoded = jwt_decode(res.data.accessToken);
				// console.log(decoded);

				///buat cookies
				const now = new Date();
				cookies.set("accessToken", accToken, {
					// expires: "1d", //new Date(decoded.exp * 1000),
					expires: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 jam * 60 menit * 60 detik * 1000 milidetik
				});

				///simpan ke redux
				dispatch(
					update({
						userid: decoded.userid,
						username: decoded.first_name + " " + decoded.last_name,
						role: decoded.role,
						token: res.data.accessToken,
					})
				);
				setIsSave(false);

				///ambil data usermenu
				dispatch(getOneUserMenu(decoded.userid));
				navigate("/");
			})

			.catch((err) => {
				console.log(err);
				setIsSave(false);
				console.log(err.response.data.success);
				if (err.response.data.success === false) {
					message.error(err.response.data.message);
				}
			});
	};

	const onFinishFailed = (e) => {
		console.log(e);
	};

	return (
		// <div
		//     style={{ backgroundImage: `url(${bgLogin})` }}
		//     className={`flex h-screen bg-slate-100 bg-no-repeat bg-cover`}
		// >
		//     <div className="m-auto">
		//         <Card
		//             title="Login"
		//             headStyle={{
		//                 fontSize: 20,
		//                 fontWeight: 700,
		//                 backgroundColor: "chocolate",
		//                 color: "white",
		//             }}
		//         >
		//             <Form
		//                 name="control-ref"
		//                 ref={formRef}
		//                 labelCol={{
		//                     span: 6,
		//                 }}
		//                 wrapperCol={{
		//                     span: 12,
		//                 }}
		//                 style={{
		//                     maxWidth: 600,
		//                 }}
		//                 initialValues={{
		//                     remember: true,
		//                 }}
		//                 onFinish={onFinish}
		//                 onFinishFailed={onFinishFailed}
		//                 autoComplete="off"
		//             >
		//                 {/* username */}
		//                 <Form.Item
		//                     label="Username"
		//                     name="email"
		//                     rules={[
		//                         {
		//                             required: true,
		//                             message: "Please input username !",
		//                         },
		//                     ]}
		//                 >
		//                     <Input />
		//                 </Form.Item>
		//                 {/* end username */}

		//                 {/* password */}
		//                 <Form.Item
		//                     label="Password"
		//                     name="password"
		//                     rules={[
		//                         {
		//                             required: true,
		//                             message: "Please input password !",
		//                         },
		//                     ]}
		//                 >
		//                     <Input.Password />
		//                 </Form.Item>
		//                 {/* end password */}

		//                 {/* BUTTON */}
		//                 <Form.Item
		//                     wrapperCol={{
		//                         offset: 8,
		//                         span: 16,
		//                     }}
		//                 >
		//                     <Button
		//                         type="primary"
		//                         htmlType="submit"
		//                         loading={isSave}
		//                         shape="round"
		//                     >
		//                         Submit
		//                     </Button>
		//                 </Form.Item>
		//             </Form>
		//         </Card>
		//     </div>
		// </div>
		<div
			className="md:bg-cover md:bg-no-repeat bg-center h-screen flex items-center md:justify-center md:pr-20"
			style={{ backgroundImage: `url(${imgDriving})` }}
		>

			<div className="p-10 flex bg-white ">
				<div className="text-center">
					<div className="mb-2 font-semibold text-5xl tracking-widest">
						GSwing
					</div>
					<div className="mb-10 font-semibold text-2xl text-slate-300 tracking-wider">
						Driving, F & B
					</div>

					<img
						src={imgLogo}
						alt="imgLogo"
						width={100}
						className="mx-auto mb-10"
					/>

					<div>
						<Form
							name="control-ref"
							ref={formRef}
							// labelCol={{
							//     span: 6,
							// }}
							// wrapperCol={{
							//     span: 12,
							// }}
							style={{
								maxWidth: 600,
							}}
							initialValues={{
								remember: true,
							}}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
							size="large"
						>
							<Form.Item
								// label="Username"
								name="email"
								rules={[
									{
										required: true,
										message: "Please input username !",
									},
								]}
							>
								<Input placeholder="username" />
							</Form.Item>

							<Form.Item
								// label="Password"
								name="password"
								rules={[
									{
										required: true,
										message: "Please input password !",
									},
								]}
							>
								<Input.Password placeholder="password" />
							</Form.Item>

							<Form.Item
							// wrapperCol={{
							//     offset: 8,
							//     span: 16,
							// }}
							>
								<Button
									type="primary"
									htmlType="submit"
									loading={isSave}
									shape="round"
									block
								>
									Submit
								</Button>
							</Form.Item>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
