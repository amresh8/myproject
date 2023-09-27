<?php
/**
 * @author Sujith Haridasan <sharidasan@owncloud.com>
 * @copyright (C) 2019 ownCloud GmbH
 * @license ownCloud Commercial License
 *
 * This code is covered by the ownCloud Commercial License.
 *
 * You should have received a copy of the ownCloud Commercial License
 * along with this program. If not, see <https://owncloud.com/licenses/owncloud-commercial/>.
 *
 */

namespace OCA\Metrics\Metrics;

use OCP\IDBConnection;

class FilesMetrics {
	/**
	 * @var IDBConnection
	 */
	private $connection;

	/**
	 * FilesMetrics constructor.
	 *
	 * @param IDBConnection $connection
	 */
	public function __construct(
		IDBConnection $connection
	) {
		$this->connection = $connection;
	}

	/**
	 * Provides total file count for the oc instance
	 *
	 * @return mixed an array of total files in oC and/or average files count per user
	 */
	public function getTotalFilesCount() {
		$qb1 = $this->connection->getQueryBuilder();
		$qb1->selectAlias($qb1->createFunction('COUNT(*)'), 'totalFiles')
			->from('filecache')
			->Where($qb1->expr()->like('path', $qb1->createPositionalParameter('files/%')))
			// mimetype = 2 => its a folder, exclude it.
			->andWhere($qb1->expr()->neq('mimetype', $qb1->expr()->literal(2)));

		$statement1 = $qb1->execute();
		/* @phan-suppress-next-line PhanDeprecatedFunction */
		$result = $statement1->fetch();
		/* @phan-suppress-next-line PhanDeprecatedFunction */
		$statement1->closeCursor();

		$result['totalFiles'] = (int)$result['totalFiles'];

		return $result;
	}
}
