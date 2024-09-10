import ClueItemArray from "../Log/ClueItemArray";
import "../Log/ClueLog.css";

export default function BroadcastImagePicker({
  broadcasts,
  hasBroadcasts,
  isForm,
  defaultValue,
}) {
  return (
    <div className="image-picker">
      <ClueItemArray
        items={broadcasts}
        hasBroadcasts={hasBroadcasts}
        isForm={isForm}
        defaultValue={defaultValue}
      />
    </div>
  );
}
