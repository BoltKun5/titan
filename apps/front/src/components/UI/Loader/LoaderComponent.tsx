import './style.scss'

export const Loader: React.FC = () => {
  return (
    <div className="Loader-loaderContainer">
      <div className="Loader-loader">
        <div className="Loader-loaderElement" />
        <div className="Loader-loaderElement" />
        <div className="Loader-loaderElement" />
        <div className="Loader-loaderElement" />
      </div>
    </div>
  )
}
