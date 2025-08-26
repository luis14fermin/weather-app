import { ImSpinner8 } from "react-icons/im";

const Loading = () => {
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute'}}>
            <ImSpinner8 className='spinner' />
        </div>
    )
}

export default Loading;