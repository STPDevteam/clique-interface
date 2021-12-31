import classNames from 'classnames'
import styles from './index.module.less'

export default function Index({ status }: { status: any }) {
  return (
    <div
      className={classNames(styles.status, {
        [styles.open]: status === 'Open',
        [styles.soon]: status === 'Soon',
        [styles.closed]: status === 'Closed',
        [styles.executable]: status === 'Executable'
      })}
    >
      <span className={styles.dot}></span>
      <span className={styles.text}>{status}</span>
    </div>
  )
}
