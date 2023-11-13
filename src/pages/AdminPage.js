
import styles from "./AdminPage.module.css";
import { UsersContainer } from "../componentsAdmin/UsersContainer";

function AdminPage() {
    return (
        <div className={styles['page']}>
            <div className={styles['general-container']}>
                <UsersContainer />
            </div>
        </div>
    );
}

export default AdminPage;
