import LogoImg from '../../assets/logo.png';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <img className="logo" src={LogoImg}></img>
      <h1 className="text-2xl font-semibold tracking-tight text-black">Fitness Tracker</h1>
    </div>
  );
};

export default Logo;
