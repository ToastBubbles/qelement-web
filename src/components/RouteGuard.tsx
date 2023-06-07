

// const RouteGuard = (props: {
//   children: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
// }) => {
//   const { children } = props;

//   const router = useRouter();
//   const [authorized, setAuthorized] = useState(false);
//   const user = useAppSelector((state: any) => state.auth);

//   const dispatch = useAppDispatch();

//   useEffect(() => {

//     const jwt = Cookies.get('userJWT') || '';

//     const spki = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCSWLaFNGyzYSlzpfcpd0OAf3c+/0SLOFwM8Sqgye2Xosmu/M0bPp12qqNa0mhHA28NbwYWXrFDYkQN55hsLzRo6hHA2S5QrhI0n0t5Db9Xdw9e3Hj0EXKPajMTMdLEOcY7oYidhVCUMGLZCeXAwJvJA/i7hHBR/16IR3r7AKrdBIeXlB8+DKswAjRS0E5RDyjxvdU4+xW15CeoiCWRjFONxyoK36/6bA87IPb/m7lrnzAfEh6NhzjiyyIbJykpkLEjhYOYuc1RuZtfWI35ftpGBdUmJY9Lxwv7oBzI82i/G6f46JDydUSOYQHx7Fxs6fSJ4giPpih1YNevAJexU/fWFaBwynR9LT6yxRTYRW/5w5oV1WzbsdoBjQFcl4bCdMzi0FOXXdmD4Ja50/HkJ5Y89o5Fe/4Q06R0IiOLgNiSH6DAskEUzC7Qzn3dywWMDACJC3SXBIRG5rBXjzrFK+qgmA1PDJ6bcySwYkHn1ZA6AS2XeBJpQYuDUqV/YHmNTKWhRMLpwq9wz0ZZLgmyC5q63bAusIy1QUhtSqu5ZT8Ea0KdfzuU6lSF7Z88GJSvGdf05Y/mTxUvdq1SEw7FqaCC5eeYsIELcK57WEnVDO/BBZrV6pTMr0lm4V1xVL1s5OUq+OmHbn4b41kXtPv1+7ZtNzjO9woF0B+8ky/7QAxG4Q== jeffn@DESKTOP-PIH3FKL'
//     const publicKey = await jose.importSPKI(spki,'RSA')

//     const {payload} = await jose.jwtVerify(jwt, publicKey, undefined);

//     const authCheck = () => {
//       if (
//       ) {
//         setAuthorized(false);
//         dispatch(setRedirectLink({ goto: router.asPath }));
//         void navigate({
          
//         });
//       } else {
//         setAuthorized(true);
//       }
//     };

//     authCheck();

//     const preventAccess = () => setAuthorized(false);

//     router.events.on("routeChangeStart", preventAccess);
//     router.events.on("routeChangeComplete", authCheck);

//     return () => {
//       router.events.off("routeChangeStart", preventAccess);
//       router.events.off("routeChangeComplete", authCheck);
//     };
//   }, [dispatch, router, router.events, user]);

//   return authorized ? children : <div>loading</div>;
// };

// export default RouteGuard;
