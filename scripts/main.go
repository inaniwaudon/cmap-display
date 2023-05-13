package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"strings"
)

type Cmap struct {
	UniToCid []UnicodeToCid `json:"uniToCid"`
}

type UnicodeToCid struct {
	Unicode int `json:"unicode"`
	Cid int `json:"cid"`
}

func main() {
	b, err := ioutil.ReadFile("UniJIS2004-UTF16-H.txt")
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	s := string(b)
	var cmap Cmap

	// cidchar
	chars := getparts(s, "cidchar")
	for _, c := range(chars) {
		lines := strings.Split(c, "\n")
		for _, l := range(lines) {
			pairs, err := getPairs(l, false)
			if err != nil {
				fmt.Fprintln(os.Stderr, err)		
				os.Exit(1)			
			}
			cmap.UniToCid = append(cmap.UniToCid, pairs...)
		}
	}

	// cidrange
	ranges := getparts(s, "cidrange")
	for _, r := range(ranges) {
		lines := strings.Split(r, "\n")
		for _, l := range(lines) {
			pairs, err := getPairs(l, true)
			if err != nil {
				fmt.Fprintln(os.Stderr, err)
				os.Exit(1)
			}
			cmap.UniToCid = append(cmap.UniToCid, pairs...)
		}
	}

	j, err := json.Marshal(cmap)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
	}
	fmt.Println(string(j))
}

func getparts(cmap string, symbol string) []string {
	begin := "begin" + symbol
	end := "end" + symbol
	var parts []string

	for {
		begini := strings.Index(cmap, begin)
		if (begini == -1) {
			break
		}
		cmap = cmap[begini + len(begin) + 1:]
		endi := strings.Index(cmap, end)
		parts = append(parts, cmap[:endi - 1])
	}
	return parts
}

func getPairs(line string, isrange bool) ([]UnicodeToCid, error) {
	toi := strings.Index(line, ">")
	unistr := line[strings.Index(line, "<") + 1:toi]
	beginuni, err := convertSurrogatePair(unistr)
	//$unicode = 0x10000 + (上位 - 0xD800) * 0x400 + (下位 - 0xDC00);

	if err != nil {
		return nil, err
	}
	line = line[toi + 1:]
	enduni := beginuni

	if isrange {
		toi := strings.Index(line, ">")
		unistr := line[strings.Index(line, "<") + 1:toi]
		enduni, err = convertSurrogatePair(unistr)
		if err != nil {
			return nil, err
		}
		line = line[toi + 1:]
	}

	cidstr := strings.TrimSpace(line)
	cidno, err := strconv.Atoi(cidstr)
	if err != nil {
		return nil, fmt.Errorf("CID is expected as number but [%s]\n", cidstr)
	}

	var pairs []UnicodeToCid
	for i := 0; i <= enduni - beginuni; i++ {
		pairs = append(pairs, UnicodeToCid{ Unicode: beginuni + i, Cid: cidno + int(i) })
	}
	return pairs, nil
}

func convertSurrogatePair(unistr string) (int, error) {
	if (len(unistr) <= 4) {
		uni, err := strconv.ParseInt(unistr, 16, 0)
		if err != nil {
			return -1, err
		}
		return int(uni), nil
	}
	higher, err := strconv.ParseInt(unistr[0:4], 16, 0)
	if (err != nil) {
		return -1, err
	}
	lower, err := strconv.ParseInt(unistr[4:], 16, 0)
	if (err != nil) {
		return -1, err
	}
	return 0x10000 + (int(higher) - 0xD800) * 0x400 + (int(lower) - 0xDC00), nil
}