import { AppBar, Grid } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import ILink from "../interfaces/ui/Link.interfaces"
import styles from '../styles/Navbar.module.css'

/**
 * The navbar to be displayed at the top of the page.
 * Integrates with the NextJs router to also provide routing when pressing the different page options.
 */
const Navbar = () => {
    const router = useRouter()
    const links : ILink[] = [
        {
            title: "Administer ID",
            url: "/ids"
        },
        {
            title: "Get credentials",
            url: "/"
        }
    ]
    const [currentIndex, setCurrentIndex] = useState(links.findIndex(e => e.url === router.pathname))

    return <AppBar position="static">
        <Grid container alignItems="center" justifyContent="flex-end">
            <Grid item xs={2}>
                <h1 className={styles.heading}>ID Issuer</h1>
            </Grid>
            <Grid item xs={true}></Grid>
                    {links.map((link, index) => {
                        let linkClass = styles.link
                        if(currentIndex === index) linkClass += ` ${styles.linkActive}`
                        return (
                        <Grid item xs={2} key={link.title} justifyContent="center">
                            <Link href={link.url}>
                                    <a onClick={() => setCurrentIndex(index)} className={linkClass}>{link.title}</a>
                            </Link>
                        </Grid>)
                    })}
        </Grid>
    </AppBar>
}

export default Navbar