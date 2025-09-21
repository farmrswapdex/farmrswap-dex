const VestingSchedule = ({ vesting }) => {
    return (
        <div className="mt-4">
            <h3 className="text-lg font-bold">Vesting Schedule</h3>
            {vesting.length > 0 ? (
                <ul>
                    {vesting.map((item, index) => (
                        <li key={index} className="flex justify-between">
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                            <span>{item.amount}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>All tokens have been vested.</p>
            )}
        </div>
    );
};

export default VestingSchedule;
