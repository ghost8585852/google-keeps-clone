import "./styles/footer.css";

function Footer(){
    let year = new Date().getFullYear();
    return(
        <p className="footer-text">copyright© by Harsh :{year}🤖</p>
    )
}
export default Footer;