import type { UserList } from "../types"
import { TVShowCard } from "./TVShowCard"


type WatchListProps = {
    userList: UserList
    onChange: () => void
}


export function WatchListCard({ userList, onChange }: WatchListProps) {

    return (
        <div className="page-container" style={{ maxWidth: 500 }}>
        <h2>{userList.name}</h2>
        {userList.userShowEntryList.length === 0 ?
            <p>No tv shows entries yet. Add your first show!</p>
            :
            userList.userShowEntryList.map(e => <TVShowCard key={e.id} entry={e} onChange={onChange} />)
        }
        </div>
    )
}