const consoleUtils = {
  printProgress: (description, current, total) => {
    const percent = ((current / total) * 100).toFixed(1)
    const newline = current === total ? "\n" : ""
    process.stdout.write(
      `\r${description} ${current} of ${total} (${percent}%)…${newline}`,
    )
  },
}

export default consoleUtils
