package vue

import (
	"encoding/json"
	"time"
)

type UnixTime struct {
	Timestamp time.Time
}

func (t UnixTime) MarshalJSON() ([]byte, error) {
	unixMilli := t.Timestamp.UnixNano() / int64(time.Millisecond)
	return json.Marshal(unixMilli)
}

func (t *UnixTime) UnmarshalJSON(data []byte) error {
	var unixMilli int64
	if err := json.Unmarshal(data, &unixMilli); err != nil {
		return err
	}
	t.Timestamp = time.Unix(0, unixMilli*int64(time.Millisecond))
	return nil
}
