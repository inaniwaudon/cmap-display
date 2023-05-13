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
	UniToCid []UnicodeToCid
}

type UnicodeToCid struct {
	Unicode int64
	Cid int
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
	beginuni, err := strconv.ParseInt(line[strings.Index(line, "<") + 1:toi], 16, 0)
	if err != nil {
		return nil, err
	}
	line = line[toi + 1:]
	enduni := beginuni

	if isrange {
		toi := strings.Index(line, ">")
		enduni, err = strconv.ParseInt(line[strings.Index(line, "<") + 1:toi], 16, 0)
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
	var i int64
	for i = 0; i <= enduni - beginuni; i++ {
		pairs = append(pairs, UnicodeToCid{ Unicode: beginuni + i, Cid: cidno + int(i) })
	}
	return pairs, nil
}
