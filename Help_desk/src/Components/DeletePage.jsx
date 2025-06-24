import Styles from './DeletePage.module.css'

export default function DeletePage() {
  return (
    <div className={Styles.PageDelete}>
      <p>Facebook Page Integration</p>
      <p>Integrated Page:Amazon Business</p>
      <button className={Styles.delete}>Delete integration</button>
      <button className={Styles.Reply}>Reply To Messages</button>
    </div>
  );
}
