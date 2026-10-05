import { OKRS } from "@/lib/content";

export function OkrTables() {
  return (
    <div className="okr-list">
      {OKRS.map((objective) => (
        <article key={objective.n} className="okr-card" id={`objective-${objective.n}`}>
          <p className="objective-no">Objective {objective.n}</p>
          <h2>{objective.title}</h2>
          <table className="okr-table">
            <caption className="caption">
              The illustrative target is the planning label. The second column is what the
              public demos already show.
            </caption>
            <thead>
              <tr>
                <th scope="col">Key result</th>
                <th scope="col">Illustrative target</th>
                <th scope="col">What the demos already show</th>
              </tr>
            </thead>
            <tbody>
              {objective.krs.map((kr) => (
                <tr key={kr.id}>
                  <th scope="row" data-label="Key result">
                    {kr.id}
                  </th>
                  <td data-label="Illustrative target">{kr.target}</td>
                  <td data-label="What the demos already show">{kr.shown}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      ))}
    </div>
  );
}
